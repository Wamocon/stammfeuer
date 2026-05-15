// =============================================================================
// src/types/database.ts
// Stammfeuer - Database type definitions (mirrors Supabase schema)
// =============================================================================

export type Plan = 'free' | 'pro' | 'family_plus'
export type MemberRole = 'initiator' | 'contributor' | 'reader'
export type CategorySlug = 'stories' | 'recipes' | 'traditions' | 'wisdom' | 'places' | 'photos'
export type LifePhase = 'childhood' | 'youth' | 'adulthood' | 'senior' | 'any'
export type NotificationType = 'new_entry' | 'new_member' | 'prompt_ready' | 'member_inactive' | 'gap_detected'

// -----------------------------------------------------------------------------
// Profile
// -----------------------------------------------------------------------------
export interface Profile {
  id: string
  full_name: string
  birth_year: number | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

// -----------------------------------------------------------------------------
// Vault
// -----------------------------------------------------------------------------
export interface Vault {
  id: string
  name: string
  description: string | null
  cover_url: string | null
  owner_id: string
  plan: Plan
  created_at: string
  updated_at: string
}

export interface VaultWithStats extends Vault {
  member_count: number
  entry_count: number
  last_entry_at: string | null
  user_role: MemberRole
}

// -----------------------------------------------------------------------------
// Vault Member
// -----------------------------------------------------------------------------
export interface VaultMember {
  id: string
  vault_id: string
  user_id: string | null
  role: MemberRole
  display_name: string | null
  family_role: string | null
  invite_email: string | null
  invite_token: string | null
  invite_accepted_at: string | null
  created_at: string
  updated_at: string
  // Joined from profiles
  profile?: Profile
}

// -----------------------------------------------------------------------------
// Category
// -----------------------------------------------------------------------------
export interface Category {
  id: string
  vault_id: string
  slug: CategorySlug
  name_de: string
  name_en: string
  icon: string
  sort_order: number
  // Aggregated
  entry_count?: number
}

// -----------------------------------------------------------------------------
// Entry metadata shapes per category
// -----------------------------------------------------------------------------
export interface StoriesMetadata {
  period_start?: string
  period_end?: string
}

export interface RecipesMetadata {
  ingredients?: string[]
  steps?: string[]
  origin?: string
  servings?: number
  prep_time_minutes?: number
}

export interface TraditionsMetadata {
  since_year?: string
  introduced_by?: string
  frequency?: 'annual' | 'monthly' | 'weekly' | 'special'
}

export interface WisdomMetadata {
  author_member_id?: string
  context?: string
}

export interface PlacesMetadata {
  address?: string
  coordinates?: { lat: number; lng: number }
  meaning?: string
}

export interface PhotosMetadata {
  description: string // mandatory for photos category
}

export type EntryMetadata =
  | StoriesMetadata
  | RecipesMetadata
  | TraditionsMetadata
  | WisdomMetadata
  | PlacesMetadata
  | PhotosMetadata

// -----------------------------------------------------------------------------
// Entry
// -----------------------------------------------------------------------------
export interface Entry {
  id: string
  vault_id: string
  category_slug: CategorySlug
  author_id: string | null
  on_behalf_of: string | null
  title: string
  body: string | null
  lang: 'de' | 'en'
  metadata: EntryMetadata
  translation_de: string | null
  translation_en: string | null
  translation_requested_at: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
  // Joined
  author?: Profile
  media?: EntryMedia[]
}

// -----------------------------------------------------------------------------
// Entry Media
// -----------------------------------------------------------------------------
export interface EntryMedia {
  id: string
  entry_id: string
  vault_id: string
  uploader_id: string | null
  storage_path: string
  mime_type: string
  file_size: number | null
  caption: string | null
  sort_order: number
  created_at: string
  // Resolved public URL (not stored in DB)
  public_url?: string
}

// -----------------------------------------------------------------------------
// Prompts
// -----------------------------------------------------------------------------
export interface PromptLibraryItem {
  id: string
  category_slug: CategorySlug
  life_phase: LifePhase
  text_de: string
  text_en: string
  created_at: string
}

export interface MemberPrompt {
  id: string
  vault_id: string
  member_id: string
  prompt_id: string | null
  custom_text_de: string | null
  custom_text_en: string | null
  scheduled_for: string
  answered_at: string | null
  entry_id: string | null
  created_at: string
  // Joined
  prompt?: PromptLibraryItem
  member?: VaultMember
}

// -----------------------------------------------------------------------------
// Notification
// -----------------------------------------------------------------------------
export interface Notification {
  id: string
  user_id: string
  vault_id: string | null
  type: NotificationType
  title_de: string
  title_en: string
  body_de: string | null
  body_en: string | null
  link: string | null
  read_at: string | null
  created_at: string
}

// -----------------------------------------------------------------------------
// Subscription
// -----------------------------------------------------------------------------
export interface Subscription {
  id: string
  vault_id: string
  plan: Plan
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  current_period_end: string | null
  cancelled_at: string | null
  created_at: string
  updated_at: string
}

// -----------------------------------------------------------------------------
// Vault Health (computed, not stored)
// -----------------------------------------------------------------------------
export interface VaultHealth {
  vault_id: string
  total_entries: number
  entries_per_category: Record<CategorySlug, number>
  active_members: number
  inactive_members: VaultMember[]
  missing_categories: CategorySlug[]
  timeline_gaps: Array<{ start_year: number; end_year: number }>
  health_score: number // 0-100
}

// -----------------------------------------------------------------------------
// Family Tree
// -----------------------------------------------------------------------------
export type FamilyRelationshipType = 'parent_child' | 'partner'
export type Gender = 'male' | 'female' | 'other'

export interface FamilyPerson {
  id: string
  vault_id: string
  member_id: string | null
  full_name: string
  birth_year: number | null
  death_year: number | null
  avatar_url: string | null
  bio: string | null
  gender: Gender | null
  pos_x: number
  pos_y: number
  created_at: string
  updated_at: string
  // Joined
  member?: VaultMember
}

export interface FamilyRelationship {
  id: string
  vault_id: string
  person_a_id: string
  person_b_id: string
  relationship_type: FamilyRelationshipType
  created_at: string
}

// -----------------------------------------------------------------------------
// Freemium limits
// -----------------------------------------------------------------------------
export const PLAN_LIMITS: Record<Plan, { max_members: number; max_entries: number }> = {
  free:        { max_members: 5,         max_entries: 20 },
  pro:         { max_members: Infinity,  max_entries: Infinity },
  family_plus: { max_members: Infinity,  max_entries: Infinity },
}

// -----------------------------------------------------------------------------
// Supabase DB type map (used with createClient<Database>)
// Minimal version - extend as needed or generate via `supabase gen types`
// -----------------------------------------------------------------------------
export interface Database {
  public: {
    Tables: {
      profiles:       { Row: Profile;       Insert: Partial<Profile>;       Update: Partial<Profile> }
      vaults:         { Row: Vault;         Insert: Partial<Vault>;         Update: Partial<Vault> }
      vault_members:  { Row: VaultMember;   Insert: Partial<VaultMember>;   Update: Partial<VaultMember> }
      categories:     { Row: Category;      Insert: Partial<Category>;      Update: Partial<Category> }
      entries:        { Row: Entry;         Insert: Partial<Entry>;         Update: Partial<Entry> }
      entry_media:    { Row: EntryMedia;    Insert: Partial<EntryMedia>;    Update: Partial<EntryMedia> }
      prompt_library: { Row: PromptLibraryItem; Insert: Partial<PromptLibraryItem>; Update: Partial<PromptLibraryItem> }
      member_prompts: { Row: MemberPrompt;  Insert: Partial<MemberPrompt>;  Update: Partial<MemberPrompt> }
      notifications:       { Row: Notification;        Insert: Partial<Notification>;        Update: Partial<Notification> }
      subscriptions:       { Row: Subscription;        Insert: Partial<Subscription>;        Update: Partial<Subscription> }
      family_persons:      { Row: FamilyPerson;        Insert: Partial<FamilyPerson>;        Update: Partial<FamilyPerson> }
      family_relationships:{ Row: FamilyRelationship;  Insert: Partial<FamilyRelationship>;  Update: Partial<FamilyRelationship> }
    }
  }
}
