/**
 * This is Used for Sample Purpose only
 * JUST FOR REFERENCE
 *
 * there is AS SUCH NO USE OF THIS FILE
 *
 * just to show how the Schema looks in DB
 *
 */

export interface User {
  id: number;
  name: string;
  email: string;
  google_id: string;
  created_at: Date;
}

export interface user_refresh_tokens {
  id: string;
  user_id: number;
  token: string;
  created_at: Date;
  expires_at: Date;
}
