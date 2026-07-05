-- users
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_users_email ON users(email);

-- categories
CREATE TABLE categories (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(50) NOT NULL UNIQUE,
    icon       VARCHAR(50),
    is_default BOOLEAN NOT NULL DEFAULT true
);

-- expenses
CREATE TABLE expenses (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id  INT NOT NULL REFERENCES categories(id),
    amount       DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    note         VARCHAR(255),
    expense_date DATE NOT NULL,
    created_at   TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, expense_date);
CREATE INDEX idx_expenses_category ON expenses(category_id);

-- budgets
CREATE TABLE budgets (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(id),  -- NULL = overall budget
    amount      DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    month       DATE NOT NULL,  -- first-of-month convention, e.g. 2026-07-01
    created_at  TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (user_id, category_id, month)
);
CREATE INDEX idx_budgets_user_month ON budgets(user_id, month);
