CREATE TYPE transaction_type AS ENUM (
  'INCOME',
  'EXPENSE'
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  type transaction_type NOT NULL,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  note TEXT,
  occurred_at DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_user_occurred_at
  ON transactions (user_id, occurred_at DESC);

CREATE INDEX idx_transactions_user_category
  ON transactions (user_id, category_id);

CREATE INDEX idx_transactions_user_account
  ON transactions (user_id, account_id);