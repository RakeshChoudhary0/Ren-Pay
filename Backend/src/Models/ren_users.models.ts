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
  mpin: string;
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

// export interface UserRefreshToken {
//   id: string;
//   user_id: number;
//   token: string;
//   is_revoked: boolean; // for logout
//   created_at: Date;
//   expires_at: Date;
// }

export interface Account {
  id: number;
  user_id: number; // one-to-one with User
  balance: number; // default 10000.00
  currency: string; // "INR"
  is_frozen: boolean; // for fraud hold
  created_at: Date;
  updated_at: Date;
}

export type TransactionStatus =
  | "PENDING" // just created
  | "PROCESSING" // debit done, credit pending
  | "SUCCESS" // fully done
  | "FAILED" // something went wrong
  | "REFUNDED"; // money sent back

export type TransactionType =
  | "TRANSFER" // normal send money
  | "REFUND"; // money returned

export interface Transaction {
  id: number;
  txn_id: string; // "TXN1699123456789X7K2P9"
  idempotency_key: string; // prevents double payment
  sender_id: number;
  receiver_id: number;
  amount: number;
  currency: string; // "INR"
  status: TransactionStatus;
  type: TransactionType;
  note: string | null; // "For dinner"
  failure_reason: string | null; // why it failed
  created_at: Date;
  updated_at: Date;
}
