# Survey Data Persistence Test Guide

## Company Registration Flow Test
1. Navigate to `/company/request-access`
2. Fill in company background (Section 1):
   - Company Name: Test Company
   - Industry: Technology
   - Organization Size: 1000-5000
   - Region: North America
   - GenAI Experience: Intermediate
3. Click "Continue to Survey"
4. Monitor console logs for:
   - Session initialization
   - Company creation with access code

5. Complete Section 2 (Surveyed Population):
   - Expected participants: 100
   - Primary roles: Select a few
   - Teams: Add 2-3 teams
   - Seniority levels: Add levels
6. Click "Next Section"
7. Monitor logs for section navigation

8. Complete Section 3 (GenAI Adoption):
   - Select accessible tools
   - Choose adoption rating
   - Select promotion start
   - Select motivations, initiatives, barriers, measures
9. Click "Next Section"

10. Complete Section 4 (Account Setup):
    - Email: test@company.com
    - Password: Test123!@#
11. Click "Complete Registration"
12. Monitor logs for:
    - Survey data submission
    - Company update with all fields
    - Session persistence
    - Redirect to dashboard

## Employee Survey Flow Test
1. Navigate to `/employee/login`
2. Enter company access code (from company registration)
3. Monitor logs for:
   - Session creation with anonymousId
   - Continuation code generation

4. Complete Section 1 (Professional Background):
   - Fill all fields
5. Click "Next Section"
6. Monitor logs for survey data save

7. Continue through all 4 sections
8. On final section, click "Complete Survey"
9. Monitor logs for:
   - Survey completion
   - isComplete flag set to true

## Expected Results
- Company data should persist all fields from sections 2-4
- Employee data should save at each section
- Both should work in preview and deployment
- Dashboard should show correct participant counts