export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      doctors: {
        Row: {
          id: string
          name: string
          specialty: string
          gender: 'male' | 'female'
          clinic: string
          location: string
          rating: number
          review_count: number
          image: string
          accepts_insurance: boolean
          bio: string
          experience: number
          languages: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          specialty: string
          gender: 'male' | 'female'
          clinic: string
          location: string
          rating?: number
          review_count?: number
          image: string
          accepts_insurance?: boolean
          bio?: string
          experience?: number
          languages?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          specialty?: string
          gender?: 'male' | 'female'
          clinic?: string
          location?: string
          rating?: number
          review_count?: number
          image?: string
          accepts_insurance?: boolean
          bio?: string
          experience?: number
          languages?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      doctor_time_slots: {
        Row: {
          id: string
          doctor_id: string
          slot_date: string
          slot_time: string
          available: boolean
          created_at: string
        }
        Insert: {
          id?: string
          doctor_id: string
          slot_date: string
          slot_time: string
          available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          doctor_id?: string
          slot_date?: string
          slot_time?: string
          available?: boolean
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          appointment_id: string
          doctor_id: string
          patient_name: string
          patient_email: string
          patient_phone: string
          patient_birth_date: string | null
          insurance: string | null
          appointment_date: string
          appointment_time: string
          reason: string
          status: 'confirmed' | 'pending' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          appointment_id: string
          doctor_id: string
          patient_name: string
          patient_email: string
          patient_phone: string
          patient_birth_date?: string | null
          insurance?: string | null
          appointment_date: string
          appointment_time: string
          reason?: string
          status?: 'confirmed' | 'pending' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          appointment_id?: string
          doctor_id?: string
          patient_name?: string
          patient_email?: string
          patient_phone?: string
          patient_birth_date?: string | null
          insurance?: string | null
          appointment_date?: string
          appointment_time?: string
          reason?: string
          status?: 'confirmed' | 'pending' | 'cancelled'
          created_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          user_id: string | null
          full_name: string
          role: 'super_admin' | 'admin'
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          full_name: string
          role?: 'super_admin' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          full_name?: string
          role?: 'super_admin' | 'admin'
          created_at?: string
        }
      }
    }
  }
}
