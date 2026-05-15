'use client'

import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { Node, NodeProps } from '@xyflow/react'
import { User, Link2 } from 'lucide-react'
import type { FamilyPerson } from '@/types/database'

export interface FamilyPersonNodeData {
  person: FamilyPerson
  isCurrentUser: boolean
  canEdit: boolean
  onEdit: (person: FamilyPerson) => void
  onLinkUser: (person: FamilyPerson) => void
  onAddRelation: (person: FamilyPerson) => void
  [key: string]: unknown
}

export type FamilyPersonNodeType = Node<FamilyPersonNodeData, 'familyPerson'>

function FamilyPersonNodeInner({ data }: NodeProps<FamilyPersonNodeType>) {
  const { person, isCurrentUser, canEdit, onEdit, onLinkUser, onAddRelation } = data
  const isDead = person.death_year !== null
  const isLinked = person.member_id !== null

  const genderColor =
    person.gender === 'male'
      ? 'border-blue-300 dark:border-blue-700'
      : person.gender === 'female'
      ? 'border-pink-300 dark:border-pink-700'
      : 'border-stone-300 dark:border-stone-600'

  const initials = person.full_name
    .split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div
      className={`relative group w-36 rounded-xl border-2 shadow-md bg-card select-none
        transition-shadow hover:shadow-lg cursor-pointer
        ${genderColor}
        ${isCurrentUser ? 'ring-2 ring-amber-400 ring-offset-1' : ''}
        ${isDead ? 'opacity-70' : ''}
      `}
      onDoubleClick={() => canEdit && onEdit(person)}
    >
      {/* Top handle - incoming from parent */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-amber-400 !w-3 !h-3 !border-2 !border-white dark:!border-stone-800"
      />

      {/* Avatar / initials */}
      <div className="flex flex-col items-center gap-1.5 p-3 pb-2">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold overflow-hidden
            ${
              person.gender === 'male'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : person.gender === 'female'
                ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300'
                : 'bg-muted text-stone-600 dark:text-stone-300'
            }`}
        >
          {person.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={person.avatar_url} alt={person.full_name} className="w-full h-full object-cover" />
          ) : (
            initials || <User size={24} />
          )}
        </div>

        {/* Name */}
        <p className="text-xs font-semibold text-center leading-tight text-gray-900 dark:text-stone-100 line-clamp-2">
          {person.full_name}
        </p>

        {/* Birth - death years */}
        {(person.birth_year || person.death_year) && (
          <p className="text-[10px] text-muted-foreground">
            {person.birth_year ?? '?'}
            {isDead ? ` - ${person.death_year}` : ''}
          </p>
        )}

        {/* Linked user indicator */}
        {isLinked && (
          <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
            <Link2 size={10} />
            Verknüpft
          </span>
        )}
      </div>

      {/* Action buttons - shown on hover */}
      {canEdit && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:flex gap-1 z-10">
          <button
            className="px-2 py-0.5 text-[10px] bg-amber-500 hover:bg-amber-600 text-white rounded-md shadow whitespace-nowrap transition-colors"
            onMouseDown={(e) => { e.stopPropagation(); onEdit(person) }}
          >
            Bearbeiten
          </button>
          <button
            className="px-2 py-0.5 text-[10px] bg-stone-600 hover:bg-stone-700 text-white rounded-md shadow whitespace-nowrap transition-colors"
            onMouseDown={(e) => { e.stopPropagation(); onAddRelation(person) }}
          >
            + Beziehung
          </button>
          {!isLinked && (
            <button
              className="px-2 py-0.5 text-[10px] bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow whitespace-nowrap transition-colors"
              onMouseDown={(e) => { e.stopPropagation(); onLinkUser(person) }}
            >
              User zuweisen
            </button>
          )}
        </div>
      )}

      {/* Bottom handle - outgoing to children */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-amber-400 !w-3 !h-3 !border-2 !border-white dark:!border-stone-800"
      />

      {/* Left handle - for partner connections */}
      <Handle
        id="left"
        type="source"
        position={Position.Left}
        className="!bg-rose-400 !w-2.5 !h-2.5 !border-2 !border-white dark:!border-stone-800"
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        className="!bg-rose-400 !w-2.5 !h-2.5 !border-2 !border-white dark:!border-stone-800"
      />
    </div>
  )
}

export const FamilyPersonNode = memo(FamilyPersonNodeInner)
