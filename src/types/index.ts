export type UserRole = 'admin' | 'user'
export type ThiefStatus = 'suspected' | 'confirmed'
export type ReportStatus = 'pending' | 'approved' | 'rejected'

export interface Profile {
  id: string
  email: string
  display_name: string
  role: UserRole
  is_active: boolean
  created_at: string
}

export interface Thief {
  id: string
  facebook_first_name: string | null
  facebook_last_name: string | null
  facebook_url: string | null
  weward_pseudos: string[]
  arnaque_type: string | null
  description: string | null
  infraction_urls: string[]
  status: ThiefStatus
  created_at: string
  created_by: string | null
  updated_at: string
  updated_by: string | null
  profiles?: Profile
}

export interface Report {
  id: string
  facebook_first_name: string | null
  facebook_last_name: string | null
  facebook_url: string | null
  weward_pseudos: string[]
  arnaque_type: string | null
  description: string | null
  infraction_urls: string[]
  status: ReportStatus
  submitted_by: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  review_note: string | null
  thief_id: string | null
  created_at: string
  profiles?: Profile
}
