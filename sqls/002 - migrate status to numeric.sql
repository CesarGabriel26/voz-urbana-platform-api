-- Migration script to change status type from string to numeric

-- 1. Migrate voz_complaints
-- Possible existing values: 'pending', 'in-progress', 'resolved', 'rejected', 'p'
ALTER TABLE voz_complaints ALTER COLUMN status TYPE INTEGER USING (
  CASE 
    WHEN status = 'p' THEN 0
    WHEN status = 'pending' THEN 0
    WHEN status = 'in-progress' THEN 1
    WHEN status = 'resolved' THEN 2
    WHEN status = 'rejected' THEN -1
    ELSE 0
  END
);
ALTER TABLE voz_complaints ALTER COLUMN status SET DEFAULT 0;

-- 2. Migrate voz_petitions
-- Possible existing values: 'active', 'collecting', 'completed', 'archived'
ALTER TABLE voz_petitions ALTER COLUMN status TYPE INTEGER USING (
  CASE 
    WHEN status = 'active' THEN 0
    WHEN status = 'collecting' THEN 0
    WHEN status = 'completed' THEN 3
    WHEN status = 'archived' THEN -1
    ELSE 0
  END
);
ALTER TABLE voz_petitions ALTER COLUMN status SET DEFAULT 0;

-- Indices are automatically updated as they refer to the column name
