export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agreement_cosigners: {
        Row: {
          agreement_id: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["cosigner_role"]
          signature_data: Json | null
          signed_at: string | null
          user_id: string | null
        }
        Insert: {
          agreement_id?: string | null
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["cosigner_role"]
          signature_data?: Json | null
          signed_at?: string | null
          user_id?: string | null
        }
        Update: {
          agreement_id?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["cosigner_role"]
          signature_data?: Json | null
          signed_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agreement_cosigners_agreement_id_fkey"
            columns: ["agreement_id"]
            isOneToOne: false
            referencedRelation: "agreements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agreement_cosigners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      agreements: {
        Row: {
          activated_at: string | null
          conditions: Json | null
          created_at: string | null
          document_id: string | null
          entrepreneur_id: string | null
          id: string
          investor_id: string | null
          opportunity_id: string | null
          pool_id: string | null
          signed_at: string | null
          status: string | null
          terms: Json
          title: string
          updated_at: string | null
        }
        Insert: {
          activated_at?: string | null
          conditions?: Json | null
          created_at?: string | null
          document_id?: string | null
          entrepreneur_id?: string | null
          id?: string
          investor_id?: string | null
          opportunity_id?: string | null
          pool_id?: string | null
          signed_at?: string | null
          status?: string | null
          terms: Json
          title: string
          updated_at?: string | null
        }
        Update: {
          activated_at?: string | null
          conditions?: Json | null
          created_at?: string | null
          document_id?: string | null
          entrepreneur_id?: string | null
          id?: string
          investor_id?: string | null
          opportunity_id?: string | null
          pool_id?: string | null
          signed_at?: string | null
          status?: string | null
          terms?: Json
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agreements_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agreements_entrepreneur_id_fkey"
            columns: ["entrepreneur_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agreements_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agreements_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agreements_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "investment_pools"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          file_size: number | null
          file_url: string
          id: string
          is_signed: boolean | null
          mime_type: string | null
          opportunity_id: string | null
          pool_id: string | null
          signed_at: string | null
          template_data: Json | null
          title: string
          transaction_id: string | null
          type: Database["public"]["Enums"]["document_type"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          is_signed?: boolean | null
          mime_type?: string | null
          opportunity_id?: string | null
          pool_id?: string | null
          signed_at?: string | null
          template_data?: Json | null
          title: string
          transaction_id?: string | null
          type: Database["public"]["Enums"]["document_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          is_signed?: boolean | null
          mime_type?: string | null
          opportunity_id?: string | null
          pool_id?: string | null
          signed_at?: string | null
          template_data?: Json | null
          title?: string
          transaction_id?: string | null
          type?: Database["public"]["Enums"]["document_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "investment_pools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow_accounts: {
        Row: {
          account_name: string
          account_number: string | null
          account_type: Database["public"]["Enums"]["payment_method"]
          created_at: string | null
          holder_name: string
          id: string
          is_active: boolean | null
          is_default: boolean | null
          pool_id: string | null
          updated_at: string | null
        }
        Insert: {
          account_name: string
          account_number?: string | null
          account_type: Database["public"]["Enums"]["payment_method"]
          created_at?: string | null
          holder_name: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          pool_id?: string | null
          updated_at?: string | null
        }
        Update: {
          account_name?: string
          account_number?: string | null
          account_type?: Database["public"]["Enums"]["payment_method"]
          created_at?: string | null
          holder_name?: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          pool_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      investment_offers: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          investor_id: string | null
          opportunity_id: string | null
          pool_id: string | null
          status: string | null
          terms: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          investor_id?: string | null
          opportunity_id?: string | null
          pool_id?: string | null
          status?: string | null
          terms?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          investor_id?: string | null
          opportunity_id?: string | null
          pool_id?: string | null
          status?: string | null
          terms?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investment_offers_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_offers_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_offers_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "investment_pools"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_pools: {
        Row: {
          category: Database["public"]["Enums"]["pool_category"]
          created_at: string | null
          created_by: string | null
          currency: string | null
          current_amount: number | null
          description: string | null
          id: string
          maximum_contribution: number | null
          minimum_contribution: number | null
          name: string
          status: string | null
          target_amount: number
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["pool_category"]
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          current_amount?: number | null
          description?: string | null
          id?: string
          maximum_contribution?: number | null
          minimum_contribution?: number | null
          name: string
          status?: string | null
          target_amount: number
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["pool_category"]
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          current_amount?: number | null
          description?: string | null
          id?: string
          maximum_contribution?: number | null
          minimum_contribution?: number | null
          name?: string
          status?: string | null
          target_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investment_pools_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      job_cards: {
        Row: {
          attachments: Json | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          progress_notes: Json | null
          status: string | null
          title: string
          updated_at: string | null
          work_order_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          progress_notes?: Json | null
          status?: string | null
          title: string
          updated_at?: string | null
          work_order_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          progress_notes?: Json | null
          status?: string | null
          title?: string
          updated_at?: string | null
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_cards_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      observers: {
        Row: {
          added_by: string | null
          can_view_financials: boolean | null
          can_view_meeting_minutes: boolean | null
          can_view_milestones: boolean | null
          can_view_reports: boolean | null
          can_view_team_details: boolean | null
          created_at: string | null
          id: string
          investment_id: string | null
          observed_user_id: string | null
          observer_id: string | null
          opportunity_id: string | null
          pool_id: string | null
          scope: Database["public"]["Enums"]["observer_scope"]
          updated_at: string | null
        }
        Insert: {
          added_by?: string | null
          can_view_financials?: boolean | null
          can_view_meeting_minutes?: boolean | null
          can_view_milestones?: boolean | null
          can_view_reports?: boolean | null
          can_view_team_details?: boolean | null
          created_at?: string | null
          id?: string
          investment_id?: string | null
          observed_user_id?: string | null
          observer_id?: string | null
          opportunity_id?: string | null
          pool_id?: string | null
          scope: Database["public"]["Enums"]["observer_scope"]
          updated_at?: string | null
        }
        Update: {
          added_by?: string | null
          can_view_financials?: boolean | null
          can_view_meeting_minutes?: boolean | null
          can_view_milestones?: boolean | null
          can_view_reports?: boolean | null
          can_view_team_details?: boolean | null
          created_at?: string | null
          id?: string
          investment_id?: string | null
          observed_user_id?: string | null
          observer_id?: string | null
          opportunity_id?: string | null
          pool_id?: string | null
          scope?: Database["public"]["Enums"]["observer_scope"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "observers_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observers_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observers_observed_user_id_fkey"
            columns: ["observed_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observers_observer_id_fkey"
            columns: ["observer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observers_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observers_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "investment_pools"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          ai_insights: Json | null
          category: Database["public"]["Enums"]["opportunity_category"]
          created_at: string | null
          currency: string | null
          description: string
          entrepreneur_id: string | null
          equity_offered: number | null
          expected_roi: number | null
          expires_at: string | null
          founded_year: number | null
          funding_target: number
          id: string
          industry: string | null
          investment_term_months: number | null
          location: string | null
          maximum_investment: number | null
          minimum_investment: number | null
          pool_id: string | null
          published_at: string | null
          risk_score: number | null
          status: Database["public"]["Enums"]["opportunity_status"] | null
          team_size: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          ai_insights?: Json | null
          category: Database["public"]["Enums"]["opportunity_category"]
          created_at?: string | null
          currency?: string | null
          description: string
          entrepreneur_id?: string | null
          equity_offered?: number | null
          expected_roi?: number | null
          expires_at?: string | null
          founded_year?: number | null
          funding_target: number
          id?: string
          industry?: string | null
          investment_term_months?: number | null
          location?: string | null
          maximum_investment?: number | null
          minimum_investment?: number | null
          pool_id?: string | null
          published_at?: string | null
          risk_score?: number | null
          status?: Database["public"]["Enums"]["opportunity_status"] | null
          team_size?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          ai_insights?: Json | null
          category?: Database["public"]["Enums"]["opportunity_category"]
          created_at?: string | null
          currency?: string | null
          description?: string
          entrepreneur_id?: string | null
          equity_offered?: number | null
          expected_roi?: number | null
          expires_at?: string | null
          founded_year?: number | null
          funding_target?: number
          id?: string
          industry?: string | null
          investment_term_months?: number | null
          location?: string | null
          maximum_investment?: number | null
          minimum_investment?: number | null
          pool_id?: string | null
          published_at?: string | null
          risk_score?: number | null
          status?: Database["public"]["Enums"]["opportunity_status"] | null
          team_size?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_entrepreneur_id_fkey"
            columns: ["entrepreneur_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "investment_pools"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_milestones: {
        Row: {
          completed_date: string | null
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          opportunity_id: string | null
          progress_percentage: number | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          opportunity_id?: string | null
          progress_percentage?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          opportunity_id?: string | null
          progress_percentage?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_milestones_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      pool_activities: {
        Row: {
          activity_type: string
          completed_at: string | null
          created_at: string | null
          description: string | null
          id: string
          initiated_by: string | null
          metadata: Json | null
          pool_id: string | null
          scheduled_at: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          activity_type: string
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          initiated_by?: string | null
          metadata?: Json | null
          pool_id?: string | null
          scheduled_at?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          activity_type?: string
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          initiated_by?: string | null
          metadata?: Json | null
          pool_id?: string | null
          scheduled_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pool_activities_initiated_by_fkey"
            columns: ["initiated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_activities_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "investment_pools"
            referencedColumns: ["id"]
          },
        ]
      }
      pool_leader_performance: {
        Row: {
          announcements_made: number | null
          created_at: string | null
          id: string
          investment_success_rate: number | null
          last_evaluation_date: string | null
          meetings_called: number | null
          member_satisfaction_score: number | null
          overall_score: number | null
          pool_id: string | null
          role: Database["public"]["Enums"]["pool_member_role"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          announcements_made?: number | null
          created_at?: string | null
          id?: string
          investment_success_rate?: number | null
          last_evaluation_date?: string | null
          meetings_called?: number | null
          member_satisfaction_score?: number | null
          overall_score?: number | null
          pool_id?: string | null
          role: Database["public"]["Enums"]["pool_member_role"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          announcements_made?: number | null
          created_at?: string | null
          id?: string
          investment_success_rate?: number | null
          last_evaluation_date?: string | null
          meetings_called?: number | null
          member_satisfaction_score?: number | null
          overall_score?: number | null
          pool_id?: string | null
          role?: Database["public"]["Enums"]["pool_member_role"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pool_leader_performance_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "investment_pools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_leader_performance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pool_members: {
        Row: {
          contribution_amount: number | null
          id: string
          is_active: boolean | null
          joined_at: string | null
          pool_id: string | null
          role: Database["public"]["Enums"]["pool_member_role"] | null
          user_id: string | null
        }
        Insert: {
          contribution_amount?: number | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          pool_id?: string | null
          role?: Database["public"]["Enums"]["pool_member_role"] | null
          user_id?: string | null
        }
        Update: {
          contribution_amount?: number | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          pool_id?: string | null
          role?: Database["public"]["Enums"]["pool_member_role"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pool_members_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "investment_pools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pool_votes: {
        Row: {
          created_at: string | null
          feedback: string | null
          id: string
          is_anonymous: boolean | null
          pool_id: string | null
          rating: number | null
          target_user_id: string | null
          vote_type: string
          voter_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          is_anonymous?: boolean | null
          pool_id?: string | null
          rating?: number | null
          target_user_id?: string | null
          vote_type: string
          voter_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          is_anonymous?: boolean | null
          pool_id?: string | null
          rating?: number | null
          target_user_id?: string | null
          vote_type?: string
          voter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pool_votes_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "investment_pools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_votes_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_votes_voter_id_fkey"
            columns: ["voter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string | null
          default_deliverables: Json | null
          description: string | null
          expected_budget_range: Json | null
          id: string
          mandatory_fields: Json | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_deliverables?: Json | null
          description?: string | null
          expected_budget_range?: Json | null
          id?: string
          mandatory_fields?: Json | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_deliverables?: Json | null
          description?: string | null
          expected_budget_range?: Json | null
          id?: string
          mandatory_fields?: Json | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_negotiations: {
        Row: {
          counter_proposal_notes: string | null
          created_at: string | null
          currency: string | null
          id: string
          proposed_deliverables: Json | null
          proposed_fee: number | null
          proposed_scope: string | null
          proposed_timeline_end: string | null
          proposed_timeline_start: string | null
          service_provider_id: string
          service_request_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          counter_proposal_notes?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          proposed_deliverables?: Json | null
          proposed_fee?: number | null
          proposed_scope?: string | null
          proposed_timeline_end?: string | null
          proposed_timeline_start?: string | null
          service_provider_id: string
          service_request_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          counter_proposal_notes?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          proposed_deliverables?: Json | null
          proposed_fee?: number | null
          proposed_scope?: string | null
          proposed_timeline_end?: string | null
          proposed_timeline_start?: string | null
          service_provider_id?: string
          service_request_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_negotiations_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_negotiations_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      service_providers: {
        Row: {
          availability_status: string | null
          created_at: string | null
          credentials: Json | null
          expertise_areas: string[] | null
          hourly_rate: number | null
          id: string
          rating: number | null
          service_type: string
          total_projects: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          availability_status?: string | null
          created_at?: string | null
          credentials?: Json | null
          expertise_areas?: string[] | null
          hourly_rate?: number | null
          id?: string
          rating?: number | null
          service_type: string
          total_projects?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          availability_status?: string | null
          created_at?: string | null
          credentials?: Json | null
          expertise_areas?: string[] | null
          hourly_rate?: number | null
          id?: string
          rating?: number | null
          service_type?: string
          total_projects?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_providers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          budget_range: Json | null
          created_at: string | null
          deadline: string | null
          description: string
          id: string
          opportunity_id: string | null
          provider_id: string | null
          requester_id: string | null
          service_type: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          budget_range?: Json | null
          created_at?: string | null
          deadline?: string | null
          description: string
          id?: string
          opportunity_id?: string | null
          provider_id?: string | null
          requester_id?: string | null
          service_type: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          budget_range?: Json | null
          created_at?: string | null
          deadline?: string | null
          description?: string
          id?: string
          opportunity_id?: string | null
          provider_id?: string | null
          requester_id?: string | null
          service_type?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          admin_confirmed_at: string | null
          amount: number
          base_currency_amount: number
          created_at: string | null
          currency: string | null
          escrow_account_id: string | null
          exchange_rate: number | null
          from_pool_id: string | null
          from_user_id: string | null
          id: string
          offer_id: string | null
          opportunity_id: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payout_confirmed_at: string | null
          platform_fee: number | null
          processing_fee: number | null
          proof_of_payment_url: string | null
          reference_number: string
          status: Database["public"]["Enums"]["transaction_status"] | null
          to_pool_id: string | null
          to_user_id: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
        }
        Insert: {
          admin_confirmed_at?: string | null
          amount: number
          base_currency_amount: number
          created_at?: string | null
          currency?: string | null
          escrow_account_id?: string | null
          exchange_rate?: number | null
          from_pool_id?: string | null
          from_user_id?: string | null
          id?: string
          offer_id?: string | null
          opportunity_id?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payout_confirmed_at?: string | null
          platform_fee?: number | null
          processing_fee?: number | null
          proof_of_payment_url?: string | null
          reference_number: string
          status?: Database["public"]["Enums"]["transaction_status"] | null
          to_pool_id?: string | null
          to_user_id?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Update: {
          admin_confirmed_at?: string | null
          amount?: number
          base_currency_amount?: number
          created_at?: string | null
          currency?: string | null
          escrow_account_id?: string | null
          exchange_rate?: number | null
          from_pool_id?: string | null
          from_user_id?: string | null
          id?: string
          offer_id?: string | null
          opportunity_id?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payout_confirmed_at?: string | null
          platform_fee?: number | null
          processing_fee?: number | null
          proof_of_payment_url?: string | null
          reference_number?: string
          status?: Database["public"]["Enums"]["transaction_status"] | null
          to_pool_id?: string | null
          to_user_id?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_escrow_account_id_fkey"
            columns: ["escrow_account_id"]
            isOneToOne: false
            referencedRelation: "escrow_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_from_pool_id_fkey"
            columns: ["from_pool_id"]
            isOneToOne: false
            referencedRelation: "investment_pools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "investment_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_to_pool_id_fkey"
            columns: ["to_pool_id"]
            isOneToOne: false
            referencedRelation: "investment_pools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          experience_years: number | null
          id: string
          industry: string | null
          investment_horizon: string | null
          investment_preferences: Json | null
          maximum_investment: number | null
          minimum_investment: number | null
          preferred_currencies: string[] | null
          risk_tolerance: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          experience_years?: number | null
          id?: string
          industry?: string | null
          investment_horizon?: string | null
          investment_preferences?: Json | null
          maximum_investment?: number | null
          minimum_investment?: number | null
          preferred_currencies?: string[] | null
          risk_tolerance?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          experience_years?: number | null
          id?: string
          industry?: string | null
          investment_horizon?: string | null
          investment_preferences?: Json | null
          maximum_investment?: number | null
          minimum_investment?: number | null
          preferred_currencies?: string[] | null
          risk_tolerance?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          email_verified_at: string | null
          full_name: string
          id: string
          last_login: string | null
          linkedin_url: string | null
          location: string | null
          phone: string | null
          phone_verified_at: string | null
          reliability_score: number | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          email_verified_at?: string | null
          full_name: string
          id?: string
          last_login?: string | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          phone_verified_at?: string | null
          reliability_score?: number | null
          role: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          email_verified_at?: string | null
          full_name?: string
          id?: string
          last_login?: string | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          phone_verified_at?: string | null
          reliability_score?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      work_orders: {
        Row: {
          agreed_deliverables: Json | null
          agreed_end_date: string | null
          agreed_fee: number | null
          agreed_scope: string
          agreed_start_date: string | null
          created_at: string | null
          currency: string | null
          id: string
          payment_status: string | null
          service_provider_id: string
          service_request_id: string
          status: string | null
          terms_agreed_at: string | null
          updated_at: string | null
        }
        Insert: {
          agreed_deliverables?: Json | null
          agreed_end_date?: string | null
          agreed_fee?: number | null
          agreed_scope: string
          agreed_start_date?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_status?: string | null
          service_provider_id: string
          service_request_id: string
          status?: string | null
          terms_agreed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          agreed_deliverables?: Json | null
          agreed_end_date?: string | null
          agreed_fee?: number | null
          agreed_scope?: string
          agreed_start_date?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_status?: string | null
          service_provider_id?: string
          service_request_id?: string
          status?: string | null
          terms_agreed_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: true
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_opportunity_risk_score: {
        Args: { opp_id: string }
        Returns: number
      }
      calculate_pool_leader_performance: {
        Args: {
          pool_uuid: string
          user_uuid: string
          leader_role: Database["public"]["Enums"]["pool_member_role"]
        }
        Returns: number
      }
      calculate_reliability_score: {
        Args: { user_uuid: string }
        Returns: number
      }
      generate_reference_number: {
        Args: { prefix?: string }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      has_role: {
        Args: { check_role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
    }
    Enums: {
      cosigner_role: "witness" | "arbiter" | "guarantor" | "co_signer"
      document_type:
        | "nda"
        | "investment_agreement"
        | "due_diligence"
        | "financial_statement"
        | "business_plan"
        | "proof_of_payment"
        | "invoice"
        | "report"
      observer_scope:
        | "all_activities"
        | "specific_opportunity"
        | "specific_pool"
        | "specific_investment"
      opportunity_category:
        | "going_concern"
        | "order_fulfillment"
        | "project_partnership"
      opportunity_status:
        | "draft"
        | "pending_approval"
        | "published"
        | "funding_in_progress"
        | "funded"
        | "in_progress"
        | "completed"
        | "cancelled"
      payment_method:
        | "ecocash"
        | "omari"
        | "innbucks"
        | "bank_transfer"
        | "paypal"
        | "stripe"
      pool_category:
        | "syndicate"
        | "collective"
        | "community_development_initiative"
        | "company"
      pool_member_role:
        | "member"
        | "chairperson"
        | "secretary"
        | "treasurer"
        | "investments_officer"
      transaction_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
      transaction_type:
        | "investment"
        | "dividend_payout"
        | "capital_payout"
        | "fee_payment"
        | "escrow_deposit"
        | "escrow_withdrawal"
        | "service_payment"
      user_role:
        | "super_admin"
        | "entrepreneur"
        | "investor"
        | "service_provider"
        | "observer"
      user_status: "pending_verification" | "active" | "suspended" | "deleted"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cosigner_role: ["witness", "arbiter", "guarantor", "co_signer"],
      document_type: [
        "nda",
        "investment_agreement",
        "due_diligence",
        "financial_statement",
        "business_plan",
        "proof_of_payment",
        "invoice",
        "report",
      ],
      observer_scope: [
        "all_activities",
        "specific_opportunity",
        "specific_pool",
        "specific_investment",
      ],
      opportunity_category: [
        "going_concern",
        "order_fulfillment",
        "project_partnership",
      ],
      opportunity_status: [
        "draft",
        "pending_approval",
        "published",
        "funding_in_progress",
        "funded",
        "in_progress",
        "completed",
        "cancelled",
      ],
      payment_method: [
        "ecocash",
        "omari",
        "innbucks",
        "bank_transfer",
        "paypal",
        "stripe",
      ],
      pool_category: [
        "syndicate",
        "collective",
        "community_development_initiative",
        "company",
      ],
      pool_member_role: [
        "member",
        "chairperson",
        "secretary",
        "treasurer",
        "investments_officer",
      ],
      transaction_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
      ],
      transaction_type: [
        "investment",
        "dividend_payout",
        "capital_payout",
        "fee_payment",
        "escrow_deposit",
        "escrow_withdrawal",
        "service_payment",
      ],
      user_role: [
        "super_admin",
        "entrepreneur",
        "investor",
        "service_provider",
        "observer",
      ],
      user_status: ["pending_verification", "active", "suspended", "deleted"],
    },
  },
} as const
