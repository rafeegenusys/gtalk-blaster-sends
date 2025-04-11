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
      business_settings: {
        Row: {
          business_id: string
          created_at: string
          media_preferences: Json | null
          openphone_api_key: string | null
          openrouter_key: string | null
          preferred_llm_model: string | null
          sms_provider: string | null
          twilio_auth_token: string | null
          twilio_sid: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          media_preferences?: Json | null
          openphone_api_key?: string | null
          openrouter_key?: string | null
          preferred_llm_model?: string | null
          sms_provider?: string | null
          twilio_auth_token?: string | null
          twilio_sid?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          media_preferences?: Json | null
          openphone_api_key?: string | null
          openrouter_key?: string | null
          preferred_llm_model?: string | null
          sms_provider?: string | null
          twilio_auth_token?: string | null
          twilio_sid?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_settings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          created_at: string
          credits_balance: number
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credits_balance?: number
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credits_balance?: number
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          business_id: string
          content: string
          created_at: string
          id: string
          media_url: string | null
          read_status: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          business_id: string
          content: string
          created_at?: string
          id?: string
          media_url?: string | null
          read_status?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          business_id?: string
          content?: string
          created_at?: string
          id?: string
          media_url?: string | null
          read_status?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          business_id: string
          created_at: string
          custom_fields: Json | null
          id: string
          name: string
          phone: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          custom_fields?: Json | null
          id?: string
          name: string
          phone: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          custom_fields?: Json | null
          id?: string
          name?: string
          phone?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      group_contacts: {
        Row: {
          contact_id: string
          group_id: string
        }
        Insert: {
          contact_id: string
          group_id: string
        }
        Update: {
          contact_id?: string
          group_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_contacts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          business_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          business_id: string
          content: string
          created_at: string
          credits_used: number | null
          id: string
          media_urls: string[] | null
          recipient_id: string
          recipient_type: string
          scheduled_time: string | null
          sender_id: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          business_id: string
          content: string
          created_at?: string
          credits_used?: number | null
          id?: string
          media_urls?: string[] | null
          recipient_id: string
          recipient_type: string
          scheduled_time?: string | null
          sender_id: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          content?: string
          created_at?: string
          credits_used?: number | null
          id?: string
          media_urls?: string[] | null
          recipient_id?: string
          recipient_type?: string
          scheduled_time?: string | null
          sender_id?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          business_id: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          business_id?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          business_id: string
          category: string | null
          content: string
          created_at: string
          id: string
          media_templates: string[] | null
          name: string
          placeholders: string[] | null
          type: string
          updated_at: string
        }
        Insert: {
          business_id: string
          category?: string | null
          content: string
          created_at?: string
          id?: string
          media_templates?: string[] | null
          name: string
          placeholders?: string[] | null
          type: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          media_templates?: string[] | null
          name?: string
          placeholders?: string[] | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "templates_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
