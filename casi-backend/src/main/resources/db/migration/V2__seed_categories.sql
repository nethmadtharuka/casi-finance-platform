-- Default categories per Part 4 (MVP scope: predefined categories only).
-- Icon values are lucide-react icon names, matching Part 9's frontend icon library,
-- so the frontend can render these directly without a separate icon-mapping table.
INSERT INTO categories (name, icon, is_default) VALUES
    ('Food',      'utensils',        true),
    ('Transport', 'car',             true),
    ('Bills',     'receipt',         true),
    ('Shopping',  'shopping-bag',    true),
    ('Other',     'more-horizontal', true);
