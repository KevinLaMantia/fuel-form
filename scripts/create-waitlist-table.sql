-- Create waitlist table for email signups
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    user_type VARCHAR(20) CHECK (user_type IN ('client', 'trainer', 'unknown')) DEFAULT 'unknown',
    referral_source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);

-- Insert some sample waitlist entries
INSERT INTO waitlist (email, user_type, referral_source) VALUES
('john.fitness@example.com', 'client', 'social_media'),
('sarah.trainer@example.com', 'trainer', 'word_of_mouth'),
('mike.gym@example.com', 'client', 'google_search'),
('lisa.coach@example.com', 'trainer', 'referral')
ON CONFLICT (email) DO NOTHING;
