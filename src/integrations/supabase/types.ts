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
      budgets: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string
          id: string
          month: number
          updated_at: string
          user_id: string
          year: number
        }
        Insert: {
          amount?: number
          category_id?: string | null
          created_at?: string
          id?: string
          month: number
          updated_at?: string
          user_id: string
          year: number
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string
          id?: string
          month?: number
          updated_at?: string
          user_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "budgets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          organization_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          name: string
          organization_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          organization_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_payments: {
        Row: {
          amount: number
          created_at: string
          credit_id: string
          description: string | null
          id: string
          payment_date: string
        }
        Insert: {
          amount: number
          created_at?: string
          credit_id: string
          description?: string | null
          id?: string
          payment_date?: string
        }
        Update: {
          amount?: number
          created_at?: string
          credit_id?: string
          description?: string | null
          id?: string
          payment_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_payments_credit_id_fkey"
            columns: ["credit_id"]
            isOneToOne: false
            referencedRelation: "credits"
            referencedColumns: ["id"]
          },
        ]
      }
      credits: {
        Row: {
          created_at: string
          description: string | null
          email: string | null
          id: string
          name: string
          person: string
          phone: string | null
          remaining_amount: number
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          name: string
          person: string
          phone?: string | null
          remaining_amount?: number
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          name?: string
          person?: string
          phone?: string | null
          remaining_amount?: number
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      episodes: {
        Row: {
          air_date: string | null
          created_at: string
          episode_number: number
          id: string
          season_number: number
          show_id: string
          title: string
          updated_at: string
        }
        Insert: {
          air_date?: string | null
          created_at?: string
          episode_number: number
          id?: string
          season_number?: number
          show_id: string
          title: string
          updated_at?: string
        }
        Update: {
          air_date?: string | null
          created_at?: string
          episode_number?: number
          id?: string
          season_number?: number
          show_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "episodes_show_id_fkey"
            columns: ["show_id"]
            isOneToOne: false
            referencedRelation: "shows"
            referencedColumns: ["id"]
          },
        ]
      }
      episodes_clone: {
        Row: {
          air_date: string | null
          created_at: string
          episode_number: number
          id: string
          season_number: number
          show_id: string
          title: string
          updated_at: string
        }
        Insert: {
          air_date?: string | null
          created_at?: string
          episode_number: number
          id?: string
          season_number?: number
          show_id: string
          title: string
          updated_at?: string
        }
        Update: {
          air_date?: string | null
          created_at?: string
          episode_number?: number
          id?: string
          season_number?: number
          show_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      friends: {
        Row: {
          created_at: string
          friend_email: string
          friend_name: string
          id: string
          notes: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_email: string
          friend_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_email?: string
          friend_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          maximum_stock_level: number | null
          minimum_stock_level: number | null
          name: string
          organization_id: string
          quantity_in_stock: number
          sku: string | null
          unit_price: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          maximum_stock_level?: number | null
          minimum_stock_level?: number | null
          name: string
          organization_id: string
          quantity_in_stock?: number
          sku?: string | null
          unit_price?: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          maximum_stock_level?: number | null
          minimum_stock_level?: number | null
          name?: string
          organization_id?: string
          quantity_in_stock?: number
          sku?: string | null
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      movies: {
        Row: {
          created_at: string
          description: string | null
          director: string | null
          duration_minutes: number | null
          genre: string | null
          id: string
          poster_url: string | null
          rating: number | null
          release_year: number | null
          status: string
          title: string
          updated_at: string
          user_id: string
          user_notes: string | null
          user_rating: number | null
          watched_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          director?: string | null
          duration_minutes?: number | null
          genre?: string | null
          id?: string
          poster_url?: string | null
          rating?: number | null
          release_year?: number | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          user_notes?: string | null
          user_rating?: number | null
          watched_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          director?: string | null
          duration_minutes?: number | null
          genre?: string | null
          id?: string
          poster_url?: string | null
          rating?: number | null
          release_year?: number | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          user_notes?: string | null
          user_rating?: number | null
          watched_at?: string | null
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          id: string
          joined_at: string
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          organization_id: string
          role?: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          preferred_currency: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          preferred_currency?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          preferred_currency?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          status: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          status?: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          status?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      settlegara_bill_splits: {
        Row: {
          amount: number
          bill_id: string
          created_at: string
          id: string
          member_id: string
          settled_at: string | null
          settled_by: string | null
          status: string
        }
        Insert: {
          amount: number
          bill_id: string
          created_at?: string
          id?: string
          member_id: string
          settled_at?: string | null
          settled_by?: string | null
          status?: string
        }
        Update: {
          amount?: number
          bill_id?: string
          created_at?: string
          id?: string
          member_id?: string
          settled_at?: string | null
          settled_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "settlegara_bill_splits_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "settlegara_bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "settlegara_bill_splits_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "settlegara_network_members"
            referencedColumns: ["id"]
          },
        ]
      }
      settlegara_bills: {
        Row: {
          created_at: string
          created_by: string
          currency: string
          description: string | null
          id: string
          network_id: string
          paid_at: string | null
          paid_by: string | null
          status: string
          title: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          currency?: string
          description?: string | null
          id?: string
          network_id: string
          paid_at?: string | null
          paid_by?: string | null
          status?: string
          title: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          currency?: string
          description?: string | null
          id?: string
          network_id?: string
          paid_at?: string | null
          paid_by?: string | null
          status?: string
          title?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "settlegara_bills_network_id_fkey"
            columns: ["network_id"]
            isOneToOne: false
            referencedRelation: "settlegara_networks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "settlegara_bills_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "settlegara_network_members"
            referencedColumns: ["id"]
          },
        ]
      }
      settlegara_network_members: {
        Row: {
          id: string
          joined_at: string
          network_id: string
          role: string
          status: string
          user_email: string
          user_name: string
        }
        Insert: {
          id?: string
          joined_at?: string
          network_id: string
          role?: string
          status?: string
          user_email: string
          user_name: string
        }
        Update: {
          id?: string
          joined_at?: string
          network_id?: string
          role?: string
          status?: string
          user_email?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "settlegara_network_members_network_id_fkey"
            columns: ["network_id"]
            isOneToOne: false
            referencedRelation: "settlegara_networks"
            referencedColumns: ["id"]
          },
        ]
      }
      settlegara_networks: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      settlegara_settlements: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string
          created_by: string
          currency: string
          from_member_id: string
          id: string
          network_id: string
          status: string
          to_member_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string
          created_by: string
          currency?: string
          from_member_id: string
          id?: string
          network_id: string
          status?: string
          to_member_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string
          created_by?: string
          currency?: string
          from_member_id?: string
          id?: string
          network_id?: string
          status?: string
          to_member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "settlegara_settlements_from_member_id_fkey"
            columns: ["from_member_id"]
            isOneToOne: false
            referencedRelation: "settlegara_network_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "settlegara_settlements_network_id_fkey"
            columns: ["network_id"]
            isOneToOne: false
            referencedRelation: "settlegara_networks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "settlegara_settlements_to_member_id_fkey"
            columns: ["to_member_id"]
            isOneToOne: false
            referencedRelation: "settlegara_network_members"
            referencedColumns: ["id"]
          },
        ]
      }
      show_universes: {
        Row: {
          created_at: string
          id: string
          show_id: string
          universe_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          show_id: string
          universe_id: string
        }
        Update: {
          created_at?: string
          id?: string
          show_id?: string
          universe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "show_universes_show_id_fkey"
            columns: ["show_id"]
            isOneToOne: false
            referencedRelation: "shows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "show_universes_universe_id_fkey"
            columns: ["universe_id"]
            isOneToOne: false
            referencedRelation: "universes"
            referencedColumns: ["id"]
          },
        ]
      }
      show_universes_clone: {
        Row: {
          created_at: string
          id: string
          show_id: string
          universe_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          show_id: string
          universe_id: string
        }
        Update: {
          created_at?: string
          id?: string
          show_id?: string
          universe_id?: string
        }
        Relationships: []
      }
      shows: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          poster_url: string | null
          slug: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          poster_url?: string | null
          slug?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          poster_url?: string | null
          slug?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      shows_clone: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          poster_url: string | null
          slug: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          poster_url?: string | null
          slug?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          poster_url?: string | null
          slug?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          created_at: string
          id: string
          inventory_item_id: string
          movement_type: string
          notes: string | null
          organization_id: string
          quantity: number
          reference: string | null
          unit_cost: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inventory_item_id: string
          movement_type: string
          notes?: string | null
          organization_id: string
          quantity: number
          reference?: string | null
          unit_cost?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inventory_item_id?: string
          movement_type?: string
          notes?: string | null
          organization_id?: string
          quantity?: number
          reference?: string | null
          unit_cost?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          category_id: string | null
          created_at: string
          date: string
          expense: number | null
          id: string
          income: number | null
          organization_id: string | null
          reason: string
          type: string
          user_id: string
          wallet_id: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          date: string
          expense?: number | null
          id?: string
          income?: number | null
          organization_id?: string | null
          reason: string
          type: string
          user_id: string
          wallet_id: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          date?: string
          expense?: number | null
          id?: string
          income?: number | null
          organization_id?: string | null
          reason?: string
          type?: string
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      transfers: {
        Row: {
          amount: number
          created_at: string
          date: string
          description: string | null
          from_wallet_id: string
          id: string
          status: string
          to_wallet_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          date?: string
          description?: string | null
          from_wallet_id: string
          id?: string
          status?: string
          to_wallet_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          description?: string | null
          from_wallet_id?: string
          id?: string
          status?: string
          to_wallet_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transfers_from_wallet_id_fkey"
            columns: ["from_wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_to_wallet_id_fkey"
            columns: ["to_wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      universes: {
        Row: {
          created_at: string
          creator_id: string | null
          description: string | null
          id: string
          is_public: boolean
          name: string
          slug: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          slug?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          slug?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      universes_clone: {
        Row: {
          created_at: string
          creator_id: string | null
          description: string | null
          id: string
          is_public: boolean
          name: string
          slug: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          slug?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          slug?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_app_preferences: {
        Row: {
          app_name: string
          created_at: string
          enabled: boolean
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          app_name: string
          created_at?: string
          enabled?: boolean
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          app_name?: string
          created_at?: string
          enabled?: boolean
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_episode_status: {
        Row: {
          created_at: string
          episode_id: string
          id: string
          status: Database["public"]["Enums"]["episode_status"]
          updated_at: string
          user_id: string
          watched_at: string | null
        }
        Insert: {
          created_at?: string
          episode_id: string
          id?: string
          status?: Database["public"]["Enums"]["episode_status"]
          updated_at?: string
          user_id: string
          watched_at?: string | null
        }
        Update: {
          created_at?: string
          episode_id?: string
          id?: string
          status?: Database["public"]["Enums"]["episode_status"]
          updated_at?: string
          user_id?: string
          watched_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_episode_status_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_show_tracking: {
        Row: {
          created_at: string
          id: string
          last_updated: string | null
          show_id: string
          total_episodes: number | null
          user_id: string
          watched_episodes: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_updated?: string | null
          show_id: string
          total_episodes?: number | null
          user_id: string
          watched_episodes?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          last_updated?: string | null
          show_id?: string
          total_episodes?: number | null
          user_id?: string
          watched_episodes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_show_tracking_show_id_fkey"
            columns: ["show_id"]
            isOneToOne: false
            referencedRelation: "shows"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          name: string
          organization_id: string | null
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          name: string
          organization_id?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          name?: string
          organization_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_slug: {
        Args: { title: string }
        Returns: string
      }
      get_network_settlements: {
        Args: { _network_id: string }
        Returns: {
          from_user_name: string
          to_user_name: string
          amount: number
        }[]
      }
      get_show_universe_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          universe_id: string
          universe_name: string
          universe_description: string
          show_id: string
          show_title: string
          show_description: string
          poster_url: string
          slug: string
          is_public: boolean
          episode_id: string
          episode_title: string
          season_number: number
          episode_number: number
          air_date: string
        }[]
      }
      get_universe_shows_episodes: {
        Args: { in_universe_slug: string }
        Returns: {
          universe_name: string
          show_title: string
          episode_title: string
          season_number: number
          episode_number: number
          air_date: string
        }[]
      }
      get_universedata: {
        Args: Record<PropertyKey, never>
        Returns: {
          universe_id: string
          show_id: string
          show_title: string
          show_description: string
          poster_url: string
          slug: string
          is_public: boolean
          episode_id: string
          episode_title: string
          season_number: number
          episode_number: number
          air_date: string
        }[]
      }
      get_user_debts: {
        Args: { target_user: string }
        Returns: {
          owed_to: string
          total_amount: number
        }[]
      }
      get_user_organization_access: {
        Args: { org_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_active_member: {
        Args: { network: string; email: string }
        Returns: boolean
      }
      is_network_admin: {
        Args: { network: string; email: string }
        Returns: boolean
      }
      is_network_creator: {
        Args: { network: string; uid: string }
        Returns: boolean
      }
      settle_transitive_debts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      simplify_network_settlements: {
        Args: { network_uuid: string }
        Returns: undefined
      }
      update_user_show_episode_counts: {
        Args: { p_user_id: string; p_show_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
      episode_status: "watched" | "not_watched"
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
      app_role: ["admin", "user"],
      episode_status: ["watched", "not_watched"],
    },
  },
} as const
