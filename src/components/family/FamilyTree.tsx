'use client'

import { useCallback, useMemo, useState, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  applyEdgeChanges,
  MarkerType,
  ConnectionMode,
  type Edge,
  type NodeChange,
  type EdgeChange,
  BackgroundVariant,
  useNodesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { FamilyPersonNode, type FamilyPersonNodeData, type FamilyPersonNodeType } from './FamilyPersonNode'
import { PersonFormModal } from './PersonFormModal'
import { LinkUserModal } from './LinkUserModal'
import { AddRelationshipModal } from './AddRelationshipModal'
import { Button } from '@/components/ui/Button'
import { UserPlus, LayoutGrid } from 'lucide-react'
import type { FamilyPerson, FamilyRelationship, VaultMember, MemberRole } from '@/types/database'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface FamilyTreeProps {
  vaultId: string
  initialPersons: FamilyPerson[]
  initialRelationships: FamilyRelationship[]
  members: VaultMember[]
  currentUserId: string
  currentRole: MemberRole
}

// ---------------------------------------------------------------------------
// Helpers: convert DB data to React Flow nodes/edges
// ---------------------------------------------------------------------------
function personsToNodes(
  persons: FamilyPerson[],
  currentUserId: string,
  canEdit: boolean,
  handlers: {
    onEdit: (p: FamilyPerson) => void
    onLinkUser: (p: FamilyPerson) => void
    onAddRelation: (p: FamilyPerson) => void
  },
): FamilyPersonNodeType[] {
  return persons.map((p) => ({
    id: p.id,
    type: 'familyPerson' as const,
    position: { x: p.pos_x, y: p.pos_y },
    data: {
      person: p,
      isCurrentUser: p.member?.user_id === currentUserId,
      canEdit,
      ...handlers,
    },
    width: 144,
    height: 160,
  }))
}

function relationshipsToEdges(relationships: FamilyRelationship[]): Edge[] {
  return relationships.map((r) => {
    const isPartner = r.relationship_type === 'partner'
    return {
      id: r.id,
      source: r.person_a_id,
      target: r.person_b_id,
      sourceHandle: isPartner ? 'right' : 'bottom',
      targetHandle: isPartner ? 'left' : 'top',
      type: isPartner ? 'straight' : 'smoothstep',
      animated: isPartner,
      label: isPartner ? '❤' : undefined,
      markerEnd: isPartner ? undefined : { type: MarkerType.ArrowClosed, color: '#d97706' },
      style: {
        stroke: isPartner ? '#f43f5e' : '#d97706',
        strokeWidth: 2,
        strokeDasharray: isPartner ? '6,3' : undefined,
      },
      labelStyle: { fontSize: 14 },
      labelBgStyle: { fill: 'transparent' },
    }
  })
}

/** Simple auto-layout: distribute nodes in a grid if they have no stored position */
function autoLayout(persons: FamilyPerson[]): FamilyPerson[] {
  const COLS = 4
  const H_GAP = 200
  const V_GAP = 220
  return persons.map((p, i) => ({
    ...p,
    pos_x: (i % COLS) * H_GAP + 60,
    pos_y: Math.floor(i / COLS) * V_GAP + 60,
  }))
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const nodeTypes = { familyPerson: FamilyPersonNode } as const

export function FamilyTree({
  vaultId,
  initialPersons,
  initialRelationships,
  members,
  currentUserId,
  currentRole,
}: FamilyTreeProps) {
  const canEdit = currentRole === 'initiator' || currentRole === 'contributor'

  const [persons, setPersons] = useState<FamilyPerson[]>(initialPersons)
  const [relationships, setRelationships] = useState<FamilyRelationship[]>(initialRelationships)

  // Modal state
  const [editPerson, setEditPerson] = useState<FamilyPerson | null>(null)
  const [showAddPerson, setShowAddPerson] = useState(false)
  const [linkUserPerson, setLinkUserPerson] = useState<FamilyPerson | null>(null)
  const [addRelFromPerson, setAddRelFromPerson] = useState<FamilyPerson | null>(null)

  // Debounce timer for persisting positions
  const [posTimer, setPosTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const handlers = useMemo(
    () => ({
      onEdit: (p: FamilyPerson) => setEditPerson(p),
      onLinkUser: (p: FamilyPerson) => setLinkUserPerson(p),
      onAddRelation: (p: FamilyPerson) => setAddRelFromPerson(p),
    }),
    [],
  )

  // ---------------------------------------------------------------------------
  // React Flow nodes / edges - managed via useNodesState so React Flow can
  // track internal state (positionAbsolute, measured dims) and avoid the
  // "node not initialized" drag warning.
  // ---------------------------------------------------------------------------
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialNodes = useMemo(() => personsToNodes(initialPersons, currentUserId, canEdit, handlers), [])
  const [nodes, setNodes, onRFNodesChange] = useNodesState<FamilyPersonNodeType>(initialNodes)

  const edges = useMemo(() => relationshipsToEdges(relationships), [relationships])

  // ---------------------------------------------------------------------------
  // Node drag - persist new position
  // ---------------------------------------------------------------------------
  const onNodesChange = useCallback(
    (changes: NodeChange<FamilyPersonNodeType>[]) => {
      // Let React Flow manage its own internal node state (positionAbsolute etc.)
      onRFNodesChange(changes)

      // Only persist when drag has ended (dragging === false)
      const posChanges = changes.filter(
        (c) => c.type === 'position' && (c as { dragging?: boolean }).dragging === false &&
          (c as { position?: { x: number; y: number } }).position !== undefined,
      ) as Array<{ type: 'position'; id: string; position: { x: number; y: number } }>

      if (posChanges.length === 0) return

      setPersons((prev) =>
        prev.map((p) => {
          const change = posChanges.find((c) => c.id === p.id)
          return change ? { ...p, pos_x: change.position.x, pos_y: change.position.y } : p
        }),
      )

      // Persist position changes to server with debounce
      if (posTimer) clearTimeout(posTimer)
      const timer = setTimeout(async () => {
        for (const change of posChanges) {
          await fetch(`/api/vaults/${vaultId}/family/${change.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pos_x: change.position.x, pos_y: change.position.y }),
          })
        }
      }, 600)
      setPosTimer(timer)
    },
    [onRFNodesChange, posTimer, vaultId],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      setRelationships((prev) => {
        const currentEdges = relationshipsToEdges(prev)
        const updated = applyEdgeChanges(changes, currentEdges)
        return prev.filter((r) => updated.some((e) => e.id === r.id))
      })
    },
    [],
  )

  // ---------------------------------------------------------------------------
  // Edge removal
  // ---------------------------------------------------------------------------
  async function handleEdgeDelete(edgeId: string) {
    await fetch(`/api/vaults/${vaultId}/family/relationships/${edgeId}`, { method: 'DELETE' })
    setRelationships((prev) => prev.filter((r) => r.id !== edgeId))
  }

  // ---------------------------------------------------------------------------
  // Auto-layout
  // ---------------------------------------------------------------------------
  async function handleAutoLayout() {
    const laid = autoLayout(persons)
    setPersons(laid)
    setNodes(personsToNodes(laid, currentUserId, canEdit, handlers))
    // Persist all positions
    await Promise.all(
      laid.map((p) =>
        fetch(`/api/vaults/${vaultId}/family/${p.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pos_x: p.pos_x, pos_y: p.pos_y }),
        }),
      ),
    )
  }

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => { if (posTimer) clearTimeout(posTimer) }
  }, [posTimer])

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-border bg-background shrink-0">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-stone-300 mr-auto">
          {persons.length} {persons.length === 1 ? 'Person' : 'Personen'}
          {' · '}
          {relationships.length} {relationships.length === 1 ? 'Verbindung' : 'Verbindungen'}
        </h2>

        {canEdit && (
          <>
            <Button size="sm" variant="secondary" onClick={handleAutoLayout} title="Personen automatisch anordnen">
              <LayoutGrid size={15} className="mr-1" />
              Auto-Layout
            </Button>
            <Button size="sm" onClick={() => setShowAddPerson(true)}>
              <UserPlus size={15} className="mr-1" />
              Person hinzufugen
            </Button>
          </>
        )}
      </div>

      {/* React Flow canvas */}
      <div className="flex-1 min-h-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgeDoubleClick={canEdit ? (_, edge) => handleEdgeDelete(edge.id) : undefined}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={2}
          deleteKeyCode={canEdit ? 'Delete' : null}
          nodesConnectable={false}
          connectionMode={ConnectionMode.Loose}
          proOptions={{ hideAttribution: true }}
          className="bg-stone-50 dark:bg-stone-950"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} className="opacity-30" />
          <Controls className="!bg-white dark:!bg-stone-800 !border-stone-200 dark:!border-stone-700 !rounded-lg !shadow-md" />
          <MiniMap
            className="!bg-stone-100 dark:!bg-stone-800 !border-stone-200 dark:!border-stone-700 !rounded-lg"
            nodeColor={(n) => {
              const p = (n.data as FamilyPersonNodeData).person
              return p.gender === 'male' ? '#93c5fd' : p.gender === 'female' ? '#f9a8d4' : '#d6d3d1'
            }}
          />
        </ReactFlow>
      </div>

      {/* Empty state */}
      {persons.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
          <p className="text-muted-foreground text-center text-sm max-w-xs">
            Noch keine Personen im Stammbaum. Fuge die erste Person hinzu!
          </p>
        </div>
      )}

      {/* Modals */}
      <PersonFormModal
        open={showAddPerson}
        onClose={() => setShowAddPerson(false)}
        vaultId={vaultId}
        onSaved={(p) => {
          setPersons((prev) => [...prev, p])
          setNodes((prev) => [...prev, personsToNodes([p], currentUserId, canEdit, handlers)[0]])
        }}
      />

      <PersonFormModal
        open={editPerson !== null}
        onClose={() => setEditPerson(null)}
        vaultId={vaultId}
        person={editPerson}
        onSaved={(updated) => {
          setPersons((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
          setNodes((prev) => prev.map((n) => n.id !== updated.id ? n : { ...n, data: { ...n.data, person: updated } }))
        }}
        onDeleted={(id) => {
          setPersons((prev) => prev.filter((p) => p.id !== id))
          setNodes((prev) => prev.filter((n) => n.id !== id))
          setRelationships((prev) =>
            prev.filter((r) => r.person_a_id !== id && r.person_b_id !== id),
          )
        }}
      />

      <LinkUserModal
        open={linkUserPerson !== null}
        onClose={() => setLinkUserPerson(null)}
        vaultId={vaultId}
        person={linkUserPerson}
        members={members}
        onLinked={(updated) => {
          setPersons((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
          setNodes((prev) => prev.map((n) => n.id !== updated.id ? n : { ...n, data: { ...n.data, person: updated } }))
        }}
      />

      <AddRelationshipModal
        open={addRelFromPerson !== null}
        onClose={() => setAddRelFromPerson(null)}
        vaultId={vaultId}
        fromPerson={addRelFromPerson}
        allPersons={persons}
        onAdded={(rel) => setRelationships((prev) => [...prev, rel])}
      />
    </div>
  )
}
