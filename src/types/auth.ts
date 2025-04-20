
import { User, Session } from '@supabase/supabase-js';

export interface AuthResponse {
  error: Error | null;
  data: {
    user: User | null;
    session: Session | null;
  };
}

export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}
