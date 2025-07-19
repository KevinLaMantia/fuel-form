-- Enhanced waitlist table with referral system (Updated)
DROP TABLE IF EXISTS waitlist CASCADE;

CREATE TABLE waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    referral_code VARCHAR(10) UNIQUE NOT NULL DEFAULT '',
    referred_by UUID REFERENCES waitlist(id),
    referral_count INTEGER DEFAULT 0,
    user_type VARCHAR(20) CHECK (user_type IN ('client', 'trainer', 'unknown')) DEFAULT 'unknown',
    referral_source VARCHAR(100),
    ab_test_variant VARCHAR(10),
    user_agent TEXT,
    signup_timestamp TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_referral_code ON waitlist(referral_code);
CREATE INDEX IF NOT EXISTS idx_waitlist_referred_by ON waitlist(referred_by);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_ab_variant ON waitlist(ab_test_variant);

-- Create a view for waitlist statistics
CREATE OR REPLACE VIEW waitlist_stats AS
SELECT 
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE user_type = 'trainer') as trainers,
    COUNT(*) FILTER (WHERE user_type = 'client') as clients,
    COUNT(DISTINCT CASE 
        WHEN user_agent IS NOT NULL 
        THEN substring(user_agent from 'Location: ([^;]+)')
        ELSE 'Unknown'
    END) as cities,
    COUNT(*) FILTER (WHERE ab_test_variant = 'A') as variant_a_count,
    COUNT(*) FILTER (WHERE ab_test_variant = 'B') as variant_b_count,
    AVG(referral_count) as avg_referrals_per_user,
    COUNT(*) FILTER (WHERE referred_by IS NOT NULL) as referred_signups
FROM waitlist;

-- Create referral leaderboard view
CREATE OR REPLACE VIEW referral_leaderboard AS
SELECT 
    email,
    referral_code,
    referral_count,
    created_at,
    ROW_NUMBER() OVER (ORDER BY referral_count DESC, created_at ASC) as rank
FROM waitlist
WHERE referral_count > 0
ORDER BY referral_count DESC, created_at ASC
LIMIT 100;

-- Function to generate unique referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists BOOLEAN;
BEGIN
    LOOP
        code := upper(substring(md5(random()::text) from 1 for 6));
        SELECT EXISTS(SELECT 1 FROM waitlist WHERE referral_code = code) INTO exists;
        IF NOT exists THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate referral codes
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
        NEW.referral_code := generate_referral_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_referral_code
    BEFORE INSERT ON waitlist
    FOR EACH ROW
    EXECUTE FUNCTION set_referral_code();

-- Insert sample data with referral relationships
INSERT INTO waitlist (email, user_type, referral_source, ab_test_variant, referral_count) VALUES
('john.fitness@example.com', 'client', 'social_media', 'A', 1),
('sarah.trainer@example.com', 'trainer', 'word_of_mouth', 'B', 0),
('mike.gym@example.com', 'client', 'google_search', 'A', 0),
('lisa.coach@example.com', 'trainer', 'referral', 'B', 0)
ON CONFLICT (email) DO NOTHING;

-- Update referral relationships (run after initial insert)
UPDATE waitlist SET referred_by = (
    SELECT id FROM waitlist WHERE email = 'john.fitness@example.com'
) WHERE email = 'mike.gym@example.com';
