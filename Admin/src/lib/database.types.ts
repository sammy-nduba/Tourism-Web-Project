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
      admin_roles: {
        Row: {
          id: string
          user_id: string
          role: string
          permissions: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role?: string
          permissions?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          permissions?: Json
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          changes: Json
          ip_address: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          changes?: Json
          ip_address?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          changes?: Json
          ip_address?: string
          created_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string
          author_id: string | null
          featured_image_url: string
          category: string
          tags: Json
          is_published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content?: string
          excerpt?: string
          author_id?: string | null
          featured_image_url?: string
          category?: string
          tags?: Json
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string
          author_id?: string | null
          featured_image_url?: string
          category?: string
          tags?: Json
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cities: {
        Row: {
          id: string
          name: string
          country_id: string
          description: string
          image_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          country_id: string
          description?: string
          image_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          country_id?: string
          description?: string
          image_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      contact_requests: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          subject: string
          message: string
          status: string
          resolved_by: string | null
          resolved_at: string | null
          notes: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string
          subject?: string
          message: string
          status?: string
          resolved_by?: string | null
          resolved_at?: string | null
          notes?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          subject?: string
          message?: string
          status?: string
          resolved_by?: string | null
          resolved_at?: string | null
          notes?: string
          created_at?: string
        }
      }
      countries: {
        Row: {
          id: string
          name: string
          code: string
          description: string
          image_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          description?: string
          image_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          description?: string
          image_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      donation_requests: {
        Row: {
          id: string
          donor_name: string
          donor_email: string
          amount: number
          currency: string
          donation_type: string
          purpose: string
          status: string
          payment_provider: string
          payment_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          donor_name: string
          donor_email: string
          amount: number
          currency?: string
          donation_type?: string
          purpose?: string
          status?: string
          payment_provider?: string
          payment_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          donor_name?: string
          donor_email?: string
          amount?: number
          currency?: string
          donation_type?: string
          purpose?: string
          status?: string
          payment_provider?: string
          payment_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          event_date: string
          end_date: string | null
          location: string
          event_type: string
          image_url: string
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          event_date: string
          end_date?: string | null
          location?: string
          event_type?: string
          image_url?: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          event_date?: string
          end_date?: string | null
          location?: string
          event_type?: string
          image_url?: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      programs: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          program_type: string
          city_id: string | null
          duration_weeks: number
          cost: number
          image_url: string
          requirements: Json
          activities: Json
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string
          program_type?: string
          city_id?: string | null
          duration_weeks?: number
          cost?: number
          image_url?: string
          requirements?: Json
          activities?: Json
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          program_type?: string
          city_id?: string | null
          duration_weeks?: number
          cost?: number
          image_url?: string
          requirements?: Json
          activities?: Json
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tours: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          city_id: string | null
          duration_days: number
          price: number
          difficulty_level: string
          max_group_size: number
          image_url: string
          gallery_urls: Json
          highlights: Json
          included: Json
          excluded: Json
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string
          city_id?: string | null
          duration_days?: number
          price?: number
          difficulty_level?: string
          max_group_size?: number
          image_url?: string
          gallery_urls?: Json
          highlights?: Json
          included?: Json
          excluded?: Json
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          city_id?: string | null
          duration_days?: number
          price?: number
          difficulty_level?: string
          max_group_size?: number
          image_url?: string
          gallery_urls?: Json
          highlights?: Json
          included?: Json
          excluded?: Json
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      volunteer_applications: {
        Row: {
          id: string
          program_id: string | null
          applicant_name: string
          applicant_email: string
          phone: string
          country: string
          date_of_birth: string | null
          experience: string
          motivation: string
          preferred_start_date: string | null
          status: string
          reviewed_by: string | null
          reviewed_at: string | null
          admin_notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          program_id?: string | null
          applicant_name: string
          applicant_email: string
          phone?: string
          country?: string
          date_of_birth?: string | null
          experience?: string
          motivation?: string
          preferred_start_date?: string | null
          status?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          admin_notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          program_id?: string | null
          applicant_name?: string
          applicant_email?: string
          phone?: string
          country?: string
          date_of_birth?: string | null
          experience?: string
          motivation?: string
          preferred_start_date?: string | null
          status?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          admin_notes?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
