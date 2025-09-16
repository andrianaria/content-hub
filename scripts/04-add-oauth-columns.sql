-- Add OAuth columns to users table
ALTER TABLE users 
ADD COLUMN oauth_provider VARCHAR(50),
ADD COLUMN oauth_provider_id VARCHAR(255);

-- Make password_hash nullable for OAuth users
ALTER TABLE users 
ALTER COLUMN password_hash DROP NOT NULL;

-- Add index for OAuth lookups
CREATE INDEX idx_users_oauth ON users(oauth_provider, oauth_provider_id);
