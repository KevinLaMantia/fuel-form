-- Insert sample exercises
INSERT INTO exercises (name, description, muscle_groups, equipment, instructions) VALUES
('Bench Press', 'Classic chest exercise', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['barbell', 'bench'], 'Lie on bench, lower bar to chest, press up'),
('Squat', 'Fundamental leg exercise', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['barbell', 'squat rack'], 'Stand with feet shoulder-width apart, squat down, stand up'),
('Deadlift', 'Full body compound movement', ARRAY['hamstrings', 'glutes', 'back', 'traps'], ARRAY['barbell'], 'Lift bar from ground to hip level'),
('Pull-ups', 'Upper body pulling exercise', ARRAY['lats', 'biceps', 'rhomboids'], ARRAY['pull-up bar'], 'Hang from bar, pull body up until chin over bar'),
('Push-ups', 'Bodyweight chest exercise', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['none'], 'Start in plank, lower body, push back up'),
('Incline Dumbbell Press', 'Upper chest exercise', ARRAY['chest', 'shoulders', 'triceps'], ARRAY['dumbbells', 'incline bench'], 'Press dumbbells on inclined bench'),
('Seated Cable Row', 'Back rowing exercise', ARRAY['lats', 'rhomboids', 'middle traps'], ARRAY['cable machine'], 'Pull cable to torso, squeeze shoulder blades'),
('Overhead Press', 'Shoulder pressing movement', ARRAY['shoulders', 'triceps', 'core'], ARRAY['barbell'], 'Press bar overhead from shoulder level'),
('Leg Press', 'Leg strengthening exercise', ARRAY['quadriceps', 'glutes'], ARRAY['leg press machine'], 'Push weight with legs from seated position'),
('Lat Pulldown', 'Lat strengthening exercise', ARRAY['lats', 'biceps'], ARRAY['lat pulldown machine'], 'Pull bar down to chest level');

-- Insert sample food items
INSERT INTO food_items (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g) VALUES
('Chicken Breast', 165, 31.0, 0.0, 3.6),
('Brown Rice', 111, 2.6, 23.0, 0.9),
('Broccoli', 34, 2.8, 7.0, 0.4),
('Greek Yogurt', 59, 10.0, 3.6, 0.4),
('Banana', 89, 1.1, 23.0, 0.3),
('Salmon', 208, 25.4, 0.0, 12.4),
('Sweet Potato', 86, 1.6, 20.0, 0.1),
('Almonds', 579, 21.2, 22.0, 49.9),
('Oatmeal', 68, 2.4, 12.0, 1.4),
('Eggs', 155, 13.0, 1.1, 11.0),
('Spinach', 23, 2.9, 3.6, 0.4),
('Quinoa', 120, 4.4, 22.0, 1.9),
('Avocado', 160, 2.0, 9.0, 15.0),
('Tuna', 144, 30.0, 0.0, 1.0),
('Apple', 52, 0.3, 14.0, 0.2);

-- Insert sample users (trainers)
INSERT INTO users (email, password_hash, first_name, last_name, user_type) VALUES
('sarah.mitchell@example.com', '$2b$10$example_hash_1', 'Sarah', 'Mitchell', 'trainer'),
('marcus.johnson@example.com', '$2b$10$example_hash_2', 'Marcus', 'Johnson', 'trainer'),
('emily.chen@example.com', '$2b$10$example_hash_3', 'Emily', 'Chen', 'trainer'),
('david.rodriguez@example.com', '$2b$10$example_hash_4', 'David', 'Rodriguez', 'trainer');

-- Insert sample users (clients)
INSERT INTO users (email, password_hash, first_name, last_name, user_type) VALUES
('john.doe@example.com', '$2b$10$example_hash_5', 'John', 'Doe', 'client'),
('jane.smith@example.com', '$2b$10$example_hash_6', 'Jane', 'Smith', 'client'),
('mike.wilson@example.com', '$2b$10$example_hash_7', 'Mike', 'Wilson', 'client'),
('lisa.brown@example.com', '$2b$10$example_hash_8', 'Lisa', 'Brown', 'client');

-- Insert trainer profiles
INSERT INTO trainer_profiles (user_id, bio, specialties, certifications, experience, pricing, location, rating, total_reviews) VALUES
((SELECT id FROM users WHERE email = 'sarah.mitchell@example.com'), 
 'Certified personal trainer specializing in sustainable weight loss and strength building.',
 ARRAY['Weight Loss', 'Strength Training', 'Nutrition'],
 ARRAY['NASM', 'Precision Nutrition'],
 '5+ years', 150.00, 'Los Angeles, CA', 4.9, 24),

((SELECT id FROM users WHERE email = 'marcus.johnson@example.com'),
 'Former competitive bodybuilder helping clients achieve their physique goals.',
 ARRAY['Bodybuilding', 'Powerlifting', 'Sports Performance'],
 ARRAY['NSCA', 'CSCS'],
 '8+ years', 200.00, 'New York, NY', 4.8, 31),

((SELECT id FROM users WHERE email = 'emily.chen@example.com'),
 'Yoga instructor focused on mind-body connection and functional movement.',
 ARRAY['Yoga', 'Pilates', 'Flexibility'],
 ARRAY['RYT-500', 'PMA'],
 '4+ years', 120.00, 'San Francisco, CA', 5.0, 18),

((SELECT id FROM users WHERE email = 'david.rodriguez@example.com'),
 'CrossFit coach passionate about functional fitness and metabolic conditioning.',
 ARRAY['CrossFit', 'HIIT', 'Endurance'],
 ARRAY['CF-L2', 'ACSM'],
 '6+ years', 175.00, 'Austin, TX', 4.7, 22);

-- Insert client profiles
INSERT INTO client_profiles (user_id, goals, fitness_level, workout_frequency, current_weight, target_weight, height, age) VALUES
((SELECT id FROM users WHERE email = 'john.doe@example.com'),
 ARRAY['Weight Loss', 'Strength Training'],
 'intermediate', '3-4', 185.0, 170.0, 180, 28),

((SELECT id FROM users WHERE email = 'jane.smith@example.com'),
 ARRAY['Muscle Building', 'General Fitness'],
 'beginner', '2-3', 135.0, 145.0, 165, 25),

((SELECT id FROM users WHERE email = 'mike.wilson@example.com'),
 ARRAY['Strength Training', 'Sports Performance'],
 'advanced', '5+', 200.0, 195.0, 185, 32),

((SELECT id FROM users WHERE email = 'lisa.brown@example.com'),
 ARRAY['Flexibility', 'General Fitness'],
 'intermediate', '3-4', 140.0, 135.0, 170, 29);

-- Insert trainer-client relationships
INSERT INTO trainer_client_relationships (trainer_id, client_id, monthly_rate, start_date) VALUES
((SELECT id FROM users WHERE email = 'sarah.mitchell@example.com'),
 (SELECT id FROM users WHERE email = 'john.doe@example.com'),
 150.00, CURRENT_DATE - INTERVAL '30 days'),

((SELECT id FROM users WHERE email = 'marcus.johnson@example.com'),
 (SELECT id FROM users WHERE email = 'jane.smith@example.com'),
 200.00, CURRENT_DATE - INTERVAL '15 days'),

((SELECT id FROM users WHERE email = 'emily.chen@example.com'),
 (SELECT id FROM users WHERE email = 'lisa.brown@example.com'),
 120.00, CURRENT_DATE - INTERVAL '45 days');

-- Insert sample workout programs
INSERT INTO workout_programs (trainer_id, name, description, duration_weeks, difficulty_level) VALUES
((SELECT id FROM users WHERE email = 'sarah.mitchell@example.com'),
 'Beginner Weight Loss', 'A comprehensive 12-week program for sustainable weight loss', 12, 'beginner'),

((SELECT id FROM users WHERE email = 'marcus.johnson@example.com'),
 'Intermediate Muscle Building', 'Build lean muscle mass with progressive overload', 16, 'intermediate'),

((SELECT id FROM users WHERE email = 'emily.chen@example.com'),
 'Flexibility & Mobility', 'Improve flexibility and functional movement patterns', 8, 'beginner');

-- Insert nutrition goals
INSERT INTO nutrition_goals (client_id, daily_calories, daily_protein, daily_carbs, daily_fat) VALUES
((SELECT id FROM users WHERE email = 'john.doe@example.com'), 2200, 165, 220, 73),
((SELECT id FROM users WHERE email = 'jane.smith@example.com'), 1800, 135, 180, 60),
((SELECT id FROM users WHERE email = 'lisa.brown@example.com'), 1900, 140, 190, 63);
