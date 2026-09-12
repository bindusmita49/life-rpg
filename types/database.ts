export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AugmentType = "Intellect" | "Strength" | "Discipline" | "Creativity";
export type ModType = "theme" | "badge" | "cosmetic";
export type MissionStatus = "active" | "completed";

export type Database = {
  public: {
    Tables: {
      operatives: {
        Row: {
          id: string;
          email: string | null;
          callsign: string | null;
          level: number;
          current_xp: number;
          credits: number;
          streak_count: number;
          last_active_date: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          callsign?: string | null;
          level?: number;
          current_xp?: number;
          credits?: number;
          streak_count?: number;
          last_active_date?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          callsign?: string | null;
          level?: number;
          current_xp?: number;
          credits?: number;
          streak_count?: number;
          last_active_date?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      missions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          augment: AugmentType;
          xp_value: number;
          credit_value: number;
          status: MissionStatus;
          created_at: string | null;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          augment: AugmentType;
          xp_value?: number;
          credit_value?: number;
          status?: MissionStatus;
          created_at?: string | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          augment?: AugmentType;
          xp_value?: number;
          credit_value?: number;
          status?: MissionStatus;
          created_at?: string | null;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      augments: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          xp: number;
          level: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          xp?: number;
          level?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          xp?: number;
          level?: number;
        };
        Relationships: [];
      };
      mods: {
        Row: {
          id: string;
          name: string;
          cost: number;
          type: ModType;
        };
        Insert: {
          id?: string;
          name: string;
          cost: number;
          type: ModType;
        };
        Update: {
          id?: string;
          name?: string;
          cost?: number;
          type?: ModType;
        };
        Relationships: [];
      };
      owned_mods: {
        Row: {
          id: string;
          user_id: string;
          mod_id: string;
          acquired_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          mod_id: string;
          acquired_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          mod_id?: string;
          acquired_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      xp_to_next_level: {
        Args: {
          level: number;
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Operative = Database["public"]["Tables"]["operatives"]["Row"];
export type OperativeInsert = Database["public"]["Tables"]["operatives"]["Insert"];
export type OperativeUpdate = Database["public"]["Tables"]["operatives"]["Update"];

export type Mission = Database["public"]["Tables"]["missions"]["Row"];
export type MissionInsert = Database["public"]["Tables"]["missions"]["Insert"];

export type Augment = Database["public"]["Tables"]["augments"]["Row"];
export type AugmentInsert = Database["public"]["Tables"]["augments"]["Insert"];

export type Mod = Database["public"]["Tables"]["mods"]["Row"];
export type OwnedMod = Database["public"]["Tables"]["owned_mods"]["Row"];
