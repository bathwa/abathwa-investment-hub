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
      users: {
        Row: {
          id: string
          email: string
          phone: string | null
          full_name: string
          role: 'super_admin' | 'entrepreneur' | 'investor' | 'service_provider' | 'observer'
          status: 'pending_verification' | 'active' | 'suspended' | 'deleted'
          avatar_url: string | null
          bio: string | null
          location: string | null
          website: string | null
          linkedin_url: string | null
          reliability_score: number
          created_at: string
          updated_at: string
          last_login: string | null
          email_verified_at: string | null
          phone_verified_at: string | null
        }
        Insert: {
          id: string
          email: string
          phone?: string | null
          full_name: string
          role: 'super_admin' | 'entrepreneur' | 'investor' | 'service_provider' | 'observer'
          status?: 'pending_verification' | 'active' | 'suspended' | 'deleted'
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          linkedin_url?: string | null
          reliability_score?: number
          created_at?: string
          updated_at?: string
          last_login?: string | null
          email_verified_at?: string | null
          phone_verified_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          phone?: string | null
          full_name?: string
          role?: 'super_admin' | 'entrepreneur' | 'investor' | 'service_provider' | 'observer'
          status?: 'pending_verification' | 'active' | 'suspended' | 'deleted'
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          linkedin_url?: string | null
          reliability_score?: number
          created_at?: string
          updated_at?: string
          last_login?: string | null
          email_verified_at?: string | null
          phone_verified_at?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          company_name: string | null
          industry: string | null
          experience_years: number | null
          investment_preferences: Json | null
          risk_tolerance: string | null
          investment_horizon: string | null
          minimum_investment: number | null
          maximum_investment: number | null
          preferred_currencies: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name?: string | null
          industry?: string | null
          experience_years?: number | null
          investment_preferences?: Json | null
          risk_tolerance?: string | null
          investment_horizon?: string | null
          minimum_investment?: number | null
          maximum_investment?: number | null
          preferred_currencies?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string | null
          industry?: string | null
          experience_years?: number | null
          investment_preferences?: Json | null
          risk_tolerance?: string | null
          investment_horizon?: string | null
          minimum_investment?: number | null
          maximum_investment?: number | null
          preferred_currencies?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      opportunities: {
        Row: {
          id: string
          title: string
          description: string
          category: 'going_concern' | 'order_fulfillment' | 'project_partnership'
          status: 'draft' | 'pending_approval' | 'published' | 'funding_in_progress' | 'funded' | 'in_progress' | 'completed' | 'cancelled'
          entrepreneur_id: string
          pool_id: string | null
          funding_target: number
          currency: string
          minimum_investment: number | null
          maximum_investment: number | null
          equity_offered: number | null
          expected_roi: number | null
          investment_term_months: number | null
          industry: string | null
          location: string | null
          team_size: number | null
          founded_year: number | null
          risk_score: number
          ai_insights: Json | null
          created_at: string
          updated_at: string
          published_at: string | null
          expires_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: 'going_concern' | 'order_fulfillment' | 'project_partnership'
          status?: 'draft' | 'pending_approval' | 'published' | 'funding_in_progress' | 'funded' | 'in_progress' | 'completed' | 'cancelled'
          entrepreneur_id: string
          pool_id?: string | null
          funding_target: number
          currency?: string
          minimum_investment?: number | null
          maximum_investment?: number | null
          equity_offered?: number | null
          expected_roi?: number | null
          investment_term_months?: number | null
          industry?: string | null
          location?: string | null
          team_size?: number | null
          founded_year?: number | null
          risk_score?: number
          ai_insights?: Json | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
          expires_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: 'going_concern' | 'order_fulfillment' | 'project_partnership'
          status?: 'draft' | 'pending_approval' | 'published' | 'funding_in_progress' | 'funded' | 'in_progress' | 'completed' | 'cancelled'
          entrepreneur_id?: string
          pool_id?: string | null
          funding_target?: number
          currency?: string
          minimum_investment?: number | null
          maximum_investment?: number | null
          equity_offered?: number | null
          expected_roi?: number | null
          investment_term_months?: number | null
          industry?: string | null
          location?: string | null
          team_size?: number | null
          founded_year?: number | null
          risk_score?: number
          ai_insights?: Json | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
          expires_at?: string | null
        }
      }
      opportunity_milestones: {
        Row: {
          id: string
          opportunity_id: string
          title: string
          description: string | null
          due_date: string
          completed_date: string | null
          status: string
          progress_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          opportunity_id: string
          title: string
          description?: string | null
          due_date: string
          completed_date?: string | null
          status?: string
          progress_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          opportunity_id?: string
          title?: string
          description?: string | null
          due_date?: string
          completed_date?: string | null
          status?: string
          progress_percentage?: number
          created_at?: string
          updated_at?: string
        }
      }
      investment_pools: {
        Row: {
          id: string
          name: string
          description: string | null
          category: 'syndicate' | 'collective' | 'community_development_initiative' | 'company'
          target_amount: number
          currency: string
          current_amount: number
          minimum_contribution: number | null
          maximum_contribution: number | null
          status: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: 'syndicate' | 'collective' | 'community_development_initiative' | 'company'
          target_amount: number
          currency?: string
          current_amount?: number
          minimum_contribution?: number | null
          maximum_contribution?: number | null
          status?: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: 'syndicate' | 'collective' | 'community_development_initiative' | 'company'
          target_amount?: number
          currency?: string
          current_amount?: number
          minimum_contribution?: number | null
          maximum_contribution?: number | null
          status?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      pool_members: {
        Row: {
          id: string
          pool_id: string
          user_id: string
          role: 'member' | 'chairperson' | 'secretary' | 'treasurer' | 'investments_officer'
          contribution_amount: number
          joined_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          pool_id: string
          user_id: string
          role: 'member' | 'chairperson' | 'secretary' | 'treasurer' | 'investments_officer'
          contribution_amount: number
          joined_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          pool_id?: string
          user_id?: string
          role?: 'member' | 'chairperson' | 'secretary' | 'treasurer' | 'investments_officer'
          contribution_amount?: number
          joined_at?: string
          is_active?: boolean
        }
      }
      pool_leader_performance: {
        Row: {
          id: string
          pool_id: string
          user_id: string
          role: 'member' | 'chairperson' | 'secretary' | 'treasurer' | 'investments_officer'
          meetings_called: number
          announcements_made: number
          investment_success_rate: number
          member_satisfaction_score: number
          overall_score: number
          last_evaluation_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pool_id: string
          user_id: string
          role: 'member' | 'chairperson' | 'secretary' | 'treasurer' | 'investments_officer'
          meetings_called?: number
          announcements_made?: number
          investment_success_rate?: number
          member_satisfaction_score?: number
          overall_score?: number
          last_evaluation_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pool_id?: string
          user_id?: string
          role?: 'member' | 'chairperson' | 'secretary' | 'treasurer' | 'investments_officer'
          meetings_called?: number
          announcements_made?: number
          investment_success_rate?: number
          member_satisfaction_score?: number
          overall_score?: number
          last_evaluation_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      investment_offers: {
        Row: {
          id: string
          opportunity_id: string
          investor_id: string
          pool_id: string | null
          amount: number
          currency: string
          terms: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          opportunity_id: string
          investor_id: string
          pool_id?: string | null
          amount: number
          currency?: string
          terms?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          opportunity_id?: string
          investor_id?: string
          pool_id?: string | null
          amount?: number
          currency?: string
          terms?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          reference_number: string
          type: 'investment' | 'dividend_payout' | 'capital_payout' | 'fee_payment' | 'escrow_deposit' | 'escrow_withdrawal' | 'service_payment'
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          amount: number
          currency: string
          exchange_rate: number
          base_currency_amount: number
          from_user_id: string | null
          to_user_id: string | null
          from_pool_id: string | null
          to_pool_id: string | null
          opportunity_id: string | null
          offer_id: string | null
          payment_method: 'ecocash' | 'omari' | 'innbucks' | 'bank_transfer' | 'paypal' | 'stripe' | null
          escrow_account_id: string | null
          proof_of_payment_url: string | null
          admin_confirmed_at: string | null
          payout_confirmed_at: string | null
          platform_fee: number
          processing_fee: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reference_number: string
          type: 'investment' | 'dividend_payout' | 'capital_payout' | 'fee_payment' | 'escrow_deposit' | 'escrow_withdrawal' | 'service_payment'
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          amount: number
          currency?: string
          exchange_rate?: number
          base_currency_amount?: number
          from_user_id?: string | null
          to_user_id?: string | null
          from_pool_id?: string | null
          to_pool_id?: string | null
          opportunity_id?: string | null
          offer_id?: string | null
          payment_method?: 'ecocash' | 'omari' | 'innbucks' | 'bank_transfer' | 'paypal' | 'stripe' | null
          escrow_account_id?: string | null
          proof_of_payment_url?: string | null
          admin_confirmed_at?: string | null
          payout_confirmed_at?: string | null
          platform_fee?: number
          processing_fee?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reference_number?: string
          type?: 'investment' | 'dividend_payout' | 'capital_payout' | 'fee_payment' | 'escrow_deposit' | 'escrow_withdrawal' | 'service_payment'
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          amount?: number
          currency?: string
          exchange_rate?: number
          base_currency_amount?: number
          from_user_id?: string | null
          to_user_id?: string | null
          from_pool_id?: string | null
          to_pool_id?: string | null
          opportunity_id?: string | null
          offer_id?: string | null
          payment_method?: 'ecocash' | 'omari' | 'innbucks' | 'bank_transfer' | 'paypal' | 'stripe' | null
          escrow_account_id?: string | null
          proof_of_payment_url?: string | null
          admin_confirmed_at?: string | null
          payout_confirmed_at?: string | null
          platform_fee?: number
          processing_fee?: number
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string | null
          record_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name?: string | null
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          table_name?: string | null
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'super_admin' | 'entrepreneur' | 'investor' | 'service_provider' | 'observer'
      user_status: 'pending_verification' | 'active' | 'suspended' | 'deleted'
      opportunity_category: 'going_concern' | 'order_fulfillment' | 'project_partnership'
      opportunity_status: 'draft' | 'pending_approval' | 'published' | 'funding_in_progress' | 'funded' | 'in_progress' | 'completed' | 'cancelled'
      pool_category: 'syndicate' | 'collective' | 'community_development_initiative' | 'company'
      pool_member_role: 'member' | 'chairperson' | 'secretary' | 'treasurer' | 'investments_officer'
      transaction_type: 'investment' | 'dividend_payout' | 'capital_payout' | 'fee_payment' | 'escrow_deposit' | 'escrow_withdrawal' | 'service_payment'
      transaction_status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
      payment_method: 'ecocash' | 'omari' | 'innbucks' | 'bank_transfer' | 'paypal' | 'stripe'
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
