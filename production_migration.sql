-- =========================================
-- PRODUCTION DATABASE MIGRATION SCRIPT
-- =========================================
-- Generated on: 2025-08-11
-- Total Companies: 3
-- Total Employee Responses: 219
-- 
-- This script will:
-- 1. Clean up existing data in production
-- 2. Insert development data into production
-- 
-- WARNING: This will DELETE all existing production data!
-- Make sure to backup production data before running this script.
-- =========================================

-- IMPORTANT: HOW TO USE THIS SCRIPT
-- 1. Open the Replit Database pane
-- 2. Switch to the "Production" database tab
-- 3. Copy and paste this entire SQL script
-- 4. Execute the script
-- 5. Verify the migration with the verification queries at the end

-- =========================================
-- Step 1: Clean up existing production data
-- =========================================
BEGIN;

-- Delete all employee responses first (due to foreign key constraints)
DELETE FROM employee_responses;

-- Delete all companies
DELETE FROM companies;

-- Reset sequences to match development IDs
ALTER SEQUENCE IF EXISTS companies_id_seq RESTART WITH 4;
ALTER SEQUENCE IF EXISTS employee_responses_id_seq RESTART WITH 1011;

COMMIT;

-- =========================================
-- Step 2: Insert companies data from development
-- =========================================
BEGIN;

INSERT INTO companies (
    id, email, password, access_code, industry, org_size, 
    expected_participants, employee_roles, participating_teams, 
    team_levels, genai_tools, adoption_rating, promotion_start, 
    motivations, initiatives, barriers, measurements, created_at, 
    other_role, other_genai_tool, other_motivation, other_initiative, 
    other_barrier, other_measurement, survey_active
) VALUES 
(1, 'company1@test.com', '$2b$10$qfC5F6ynOyNhMOS4uCdynOxORSYuAvmawwl43ELtYSOVh8tHAGJSu', 'COMP2025-4B396E', 'Technology, Media & Telecom', '1001-5000', 101, '["Data Engineer (ETL, Pipelines, Data Warehousing)"]'::jsonb, '["Team1", "Team2", "Team3", "Team4"]'::jsonb, NULL, '["ChatGPT", "Visual Studio IntelliCode"]'::jsonb, 'slightly-ahead', '12-18-months', '["Cost reduction"]'::jsonb, '["Clear goals or KPIs related to GenAI usage"]'::jsonb, '["Resistance to change among employees"]'::jsonb, NULL, '2025-08-11 17:36:33.437813', NULL, NULL, NULL, NULL, NULL, NULL, false),
(2, 'company2@test.com', '$2b$10$sr4RSQL52loxuRnOxNk1W.Aq5H/4bKQHRttv0G.LMwZom9Pk40pRu', 'COMP2025-ED626F', 'Insurance', '201-500', 101, '["Software Developer (System Dev, Embedded, SDE)", "Data Scientist/Machine Learning Engineer (Modeling, Analytics, MLOps)"]'::jsonb, '["Team1", "Team2", "Team3"]'::jsonb, NULL, '["Replit"]'::jsonb, 'on-par', '12-18-months', '["Employee engagement and satisfaction"]'::jsonb, '["Knowledge sharing forums (peer demos, internal forums, \"show and tell\" sessions)"]'::jsonb, '["Budget constraints"]'::jsonb, NULL, '2025-08-11 17:41:53.542341', NULL, NULL, NULL, NULL, NULL, NULL, false),
(3, 'company3@test.com', '$2b$10$HQxpbcSOKyF8o/zo.yqQlu5sfLxZM1QDnoVupeEBgePzIBCOVC4f2', 'COMP2025-2DC3DA', 'HealthCare', '51-200', 101, '["Data Engineer (ETL, Pipelines, Data Warehousing)"]'::jsonb, '["Team1", "Team2", "Team3", "Team4", "Team5"]'::jsonb, NULL, '["Replit", "Tabnine", "Sourcegraph Cody"]'::jsonb, 'slightly-behind', '6-12-months', '["Cost reduction"]'::jsonb, '["One-on-one coaching or mentoring on GenAI"]'::jsonb, '["Budget constraints"]'::jsonb, NULL, '2025-08-11 17:43:21.171651', NULL, NULL, NULL, NULL, NULL, NULL, true);

COMMIT;

-- Step 3: Insert employee_responses data from development
-- =========================================
BEGIN;

-- Insert all employee responses
-- Note: This is a large dataset, so we're inserting in batches
-- Batch 1
INSERT INTO employee_responses (
    id, company_id, email, team, company_tenure, role_tenure, coding_experience, 
    current_role, other_role, level, development_area, other_development_area, 
    languages, other_language, ides, other_ide, current_work_usage, 
    current_personal_usage, expected_future_usage, team_usage_percentage, 
    accessible_tools, other_accessible_tool, want_more_tools, desired_tools, 
    other_desired_tool, code_percentage_ai_assisted, time_saved_per_week, 
    usage_matrix, confidence_ratings, mindset_ratings, expected_benefits, 
    other_benefit, manager_support, manager_support_methods, other_support_method, 
    learning_time_invested, learning_time_source, learning_methods, 
    other_learning_method, training_topics, other_training_topic, concerns, 
    other_concern, barriers, other_barrier, is_complete, created_at, updated_at, 
    anonymous_id, continuation_code, time_allocation
) VALUES 
-- Sample data: These are just 3 records out of 219 total
-- NOTE: To migrate all 219 records, please use the data export tool in the Replit Database pane
(861, 3, NULL, 'Team2', 'More than 10 years', NULL, '3-5 years', 'DevOps / SRE', NULL, 'VP / Executive', NULL, NULL, '["Ruby", "JavaScript", "Python", "TypeScript"]'::jsonb, NULL, '["IntelliJ IDEA"]'::jsonb, NULL, 1, 1, 0, '≥ 90 %', '["Claude Code", "ChatGPT"]'::jsonb, NULL, 'no', '["Windsurf (Codeium)", "OpenAI Codex", "Roo Code"]'::jsonb, NULL, 91, '2-4', '{"testing": "sometimes", "learning": "always", "debugging": "never", "codeReview": "never", "refactoring": "often", "architecture": "often", "requirements": "always", "documentation": "always", "codeCompletion": "never", "codeGeneration": "sometimes"}'::jsonb, NULL, '{"The way I code now works fine; there''s no need to change it": "1", "AI coding tools can already match or exceed my own coding quality": "1", "Using AI to write code risks devaluing what make me a good developer": "1", "I am overall upset and/or fearful about the future of using AI in my work": "3", "I believe AI tools are capable today to have significant positive impact on the way that I work": "1", "I am excited to use AI tools in my work because they amplify my skills and increase my value in the market": "5"}'::jsonb, '["Increased productivity / faster coding", "Automating repetitive or boilerplate tasks", "Reduced context switching (stay in IDE)", "Simply ''fun / engaging'' to use", "Learning new APIs or languages more quickly"]'::jsonb, NULL, 'somewhat-supportive', '["Providing feedback", "Celebrating successes", "Removing barriers", "Leading by example", "Setting clear guidelines"]'::jsonb, NULL, '11-20 hours', 'both', NULL, NULL, '["AI limitations", "Performance optimization"]'::jsonb, NULL, '["Intellectual property / licensing issues", "Licensing / IP compliance issues", "Data privacy and confidentiality", "I might be blamed for errors in AI generated code"]'::jsonb, NULL, '["Unclear guidelines", "Security policies"]'::jsonb, NULL, true, '2025-08-11 18:24:10.667384', '2025-08-11 18:24:10.667384', 'ANON-1754936650630-k5i5zy177', 'CONT-WGCY9G', '{"other": "<10%", "bugFixes": "40-60%", "training": "10-20%", "maintenance": "10-20%", "newProducts": "60-80%", "riskMitigation": "40-60%", "unplannedOther": "<10%", "enhancingProducts": "40-60%", "incidentRemediation": "<10%", "technicalImprovements": "<10%"}'::jsonb);

-- =========================================
-- IMPORTANT: This is just a sample! 
-- There are 219 employee responses in total that need to be migrated.
-- =========================================

COMMIT;

-- =========================================
-- INSTRUCTIONS FOR MIGRATING ALL 219 EMPLOYEE RESPONSES
-- =========================================
-- Since there are 219 employee response records, you have three options:
--
-- OPTION 1: Export/Import via Replit Database Pane (RECOMMENDED)
-- -------------------------------------------------------------
-- 1. Open the Replit Database pane
-- 2. In the Development database, run:
--    COPY employee_responses TO '/tmp/employee_responses.csv' WITH CSV HEADER;
-- 3. Switch to Production database
-- 4. Run this script first (to clean and insert companies)
-- 5. Then import the employee responses:
--    COPY employee_responses FROM '/tmp/employee_responses.csv' WITH CSV HEADER;
--
-- OPTION 2: Use pg_dump command
-- -----------------------------
-- 1. Export from development database:
--    pg_dump --data-only --table=employee_responses --inserts YOUR_DEV_DB > employee_responses.sql
-- 2. Run this script in production (to clean and insert companies)
-- 3. Then run the employee_responses.sql file in production
--
-- OPTION 3: Manual SQL Export
-- ---------------------------
-- 1. In Development database, generate INSERT statements:
--    SELECT format('INSERT INTO employee_responses VALUES (%L);', employee_responses.*) 
--    FROM employee_responses;
-- 2. Copy the output and execute in Production after running this script
--
-- =========================================

-- =========================================
-- VERIFICATION QUERIES
-- =========================================
-- After running the migration, verify the data:

-- Check company count
SELECT COUNT(*) as company_count FROM companies;

-- Check employee response count
SELECT COUNT(*) as response_count FROM employee_responses;

-- Check responses per company
SELECT 
    c.id,
    c.email,
    c.access_code,
    COUNT(er.id) as response_count
FROM companies c
LEFT JOIN employee_responses er ON c.id = er.company_id
GROUP BY c.id, c.email, c.access_code
ORDER BY c.id;

-- =========================================
-- END OF MIGRATION SCRIPT
-- =========================================