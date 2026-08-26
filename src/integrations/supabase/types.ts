export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      bairros: {
        Row: {
          created_at: string
          geometria: Json
          id: string
          liderancas: number
          locais: number
          nome: string
          populacao: number
          quadrante: string
          regiao_urbana: string
          updated_at: string
          votos: number
          votos_mil: number
          votos_por_local: number
        }
        Insert: {
          created_at?: string
          geometria?: Json
          id?: string
          liderancas?: number
          locais?: number
          nome: string
          populacao?: number
          quadrante?: string
          regiao_urbana: string
          updated_at?: string
          votos?: number
          votos_mil?: number
          votos_por_local?: number
        }
        Update: {
          created_at?: string
          geometria?: Json
          id?: string
          liderancas?: number
          locais?: number
          nome?: string
          populacao?: number
          quadrante?: string
          regiao_urbana?: string
          updated_at?: string
          votos?: number
          votos_mil?: number
          votos_por_local?: number
        }
        Relationships: []
      }
      fichas: {
        Row: {
          autorizou_contato: boolean
          bairro: string
          codigo_convite: string | null
          created_at: string
          foto: string | null
          id: string
          lideranca: string
          nome: string
          observacao: string | null
          pautas: string[]
          proximo_passo: string
          situacao_voto: string
          telefone: string | null
          user_id: string
        }
        Insert: {
          autorizou_contato?: boolean
          bairro: string
          codigo_convite?: string | null
          created_at?: string
          foto?: string | null
          id?: string
          lideranca: string
          nome: string
          observacao?: string | null
          pautas?: string[]
          proximo_passo?: string
          situacao_voto: string
          telefone?: string | null
          user_id: string
        }
        Update: {
          autorizou_contato?: boolean
          bairro?: string
          codigo_convite?: string | null
          created_at?: string
          foto?: string | null
          id?: string
          lideranca?: string
          nome?: string
          observacao?: string | null
          pautas?: string[]
          proximo_passo?: string
          situacao_voto?: string
          telefone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      fotos_lideranca: {
        Row: {
          chave: string
          created_at: string
          foto: string
          id: string
          nome: string
          user_id: string
        }
        Insert: {
          chave: string
          created_at?: string
          foto: string
          id?: string
          nome: string
          user_id: string
        }
        Update: {
          chave?: string
          created_at?: string
          foto?: string
          id?: string
          nome?: string
          user_id?: string
        }
        Relationships: []
      }
      liderancas: {
        Row: {
          atuacao: string
          bairro: string
          created_at: string
          id: string
          lat: number
          lng: number
          local_ref: string
          nome: string
          perfil: string
          regiao_urbana: string
          segmento: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          atuacao?: string
          bairro?: string
          created_at?: string
          id?: string
          lat?: number
          lng?: number
          local_ref?: string
          nome: string
          perfil?: string
          regiao_urbana?: string
          segmento?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          atuacao?: string
          bairro?: string
          created_at?: string
          id?: string
          lat?: number
          lng?: number
          local_ref?: string
          nome?: string
          perfil?: string
          regiao_urbana?: string
          segmento?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      locais_votacao: {
        Row: {
          bairro: string
          created_at: string
          distancia: number
          id: string
          lat: number
          lng: number
          nome: string
          regiao_urbana: string
          seccoes: number
          updated_at: string
          votos: number
          zona: number
        }
        Insert: {
          bairro?: string
          created_at?: string
          distancia?: number
          id?: string
          lat?: number
          lng?: number
          nome: string
          regiao_urbana?: string
          seccoes?: number
          updated_at?: string
          votos?: number
          zona?: number
        }
        Update: {
          bairro?: string
          created_at?: string
          distancia?: number
          id?: string
          lat?: number
          lng?: number
          nome?: string
          regiao_urbana?: string
          seccoes?: number
          updated_at?: string
          votos?: number
          zona?: number
        }
        Relationships: []
      }
      municipios: {
        Row: {
          coordenacao: string | null
          created_at: string
          geometria: Json
          id: string
          liderancas: number
          nome: string
          populacao: number
          quadrante: string
          regiao: string
          sede: Json
          status: string
          updated_at: string
          votos: number
          votos_mil: number
        }
        Insert: {
          coordenacao?: string | null
          created_at?: string
          geometria?: Json
          id?: string
          liderancas?: number
          nome: string
          populacao?: number
          quadrante?: string
          regiao: string
          sede?: Json
          status?: string
          updated_at?: string
          votos?: number
          votos_mil?: number
        }
        Update: {
          coordenacao?: string | null
          created_at?: string
          geometria?: Json
          id?: string
          liderancas?: number
          nome?: string
          populacao?: number
          quadrante?: string
          regiao?: string
          sede?: Json
          status?: string
          updated_at?: string
          votos?: number
          votos_mil?: number
        }
        Relationships: []
      }
      rede: {
        Row: {
          chave: string
          created_at: string
          dados: Json
          id: string
          updated_at: string
        }
        Insert: {
          chave: string
          created_at?: string
          dados?: Json
          id?: string
          updated_at?: string
        }
        Update: {
          chave?: string
          created_at?: string
          dados?: Json
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      regioes_urbanas: {
        Row: {
          created_at: string
          geometria: Json
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          geometria?: Json
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          geometria?: Json
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
