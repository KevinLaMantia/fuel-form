INSERT INTO waitlist (email, user_type, referral_source, ab_test_variant, created_at) VALUES
('john.doe@example.com', 'client', 'social_media', 'A', NOW() - INTERVAL '5 days'),
('jane.trainer@example.com', 'trainer', 'referral', 'B', NOW() - INTERVAL '4 days'),
('mike.smith@test.com', 'client', 'organic', 'A', NOW() - INTERVAL '3 days'),
('sarah.coach@fitness.com', 'trainer', 'social_media', 'B', NOW() - INTERVAL '2 days'),
('david.client@mail.com', 'client', 'organic', 'A', NOW() - INTERVAL '1 day'),
('emily.fit@gym.com', 'trainer', 'referral', 'A', NOW() - INTERVAL '10 hours'),
('chris.user@web.net', 'client', 'social_media', 'B', NOW() - INTERVAL '5 hours'),
('olivia.health@app.org', 'client', 'organic', 'A', NOW() - INTERVAL '2 hours'),
('daniel.pro@trainer.co', 'trainer', 'referral', 'B', NOW() - INTERVAL '30 minutes'),
('sophia.new@user.io', 'client', 'social_media', 'A', NOW() - INTERVAL '10 minutes');

-- Add more diverse data for better city estimation
INSERT INTO waitlist (email, user_type, referral_source, ab_test_variant, created_at) VALUES
('user1@citya.com', 'client', 'organic', 'A', NOW() - INTERVAL '6 days'),
('user2@cityb.com', 'client', 'referral', 'B', NOW() - INTERVAL '5 days'),
('user3@cityc.com', 'trainer', 'social_media', 'A', NOW() - INTERVAL '4 days'),
('user4@cityd.com', 'client', 'organic', 'B', NOW() - INTERVAL '3 days'),
('user5@citye.com', 'trainer', 'referral', 'A', NOW() - INTERVAL '2 days'),
('user6@cityf.com', 'client', 'social_media', 'B', NOW() - INTERVAL '1 day'),
('user7@cityg.com', 'client', 'organic', 'A', NOW() - INTERVAL '12 hours'),
('user8@cityh.com', 'trainer', 'referral', 'B', NOW() - INTERVAL '6 hours'),
('user9@cityi.com', 'client', 'social_media', 'A', NOW() - INTERVAL '3 hours'),
('user10@cityj.com', 'client', 'organic', 'B', NOW() - INTERVAL '1 hour');

-- Verification query (optional, for debugging)
SELECT * FROM waitlist;
