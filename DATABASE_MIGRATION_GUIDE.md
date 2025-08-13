# Database Migration Guide: Development → Production

## ⚠️ Important Notice
I cannot directly access or modify your production database for security reasons. You'll need to perform these operations manually through the Replit Database pane.

## 📊 Current Data Summary
- **Development Database:**
  - 3 Companies
  - 219 Employee Responses
  
## 🔧 Migration Steps

### Step 1: Backup Production Database (Recommended)
Before proceeding, it's highly recommended to backup your production database in case you need to restore it later.

### Step 2: Access the Replit Database Pane
1. Open the Replit Database pane (in the Tools section)
2. You'll see two tabs: "Development" and "Production"

### Step 3: Clean and Migrate Companies Data
1. Switch to the **Production** tab in the Database pane
2. Open the SQL console
3. Copy and paste the contents from `production_migration.sql` 
4. Execute the script
   - This will:
     - Delete all existing production data (companies and employee_responses)
     - Insert the 3 companies from development

### Step 4: Migrate Employee Responses (219 records)
Choose one of these methods:

#### Method A: Using COPY Command (Fastest)
**In Development tab:**
```sql
-- Export to CSV
COPY employee_responses TO '/tmp/employee_responses.csv' WITH CSV HEADER;
```

**In Production tab:**
```sql
-- Import from CSV
COPY employee_responses FROM '/tmp/employee_responses.csv' WITH CSV HEADER;
```

#### Method B: Direct SQL Export/Import
**In Development tab:**
```sql
-- Generate INSERT statements
SELECT 'INSERT INTO employee_responses VALUES (' || 
  COALESCE(id::text, 'NULL') || ', ' ||
  COALESCE(company_id::text, 'NULL') || ', ' ||
  -- ... (continue for all columns)
  ');' as insert_statement
FROM employee_responses
ORDER BY id;
```
Then copy all the output and execute in Production.

#### Method C: Using Replit's Export Feature
1. In the Development database tab, click on the employee_responses table
2. Use the "Export" button if available
3. Switch to Production and import the exported data

### Step 5: Verify the Migration
After migration, run these queries in Production to verify:

```sql
-- Check company count (should be 3)
SELECT COUNT(*) as company_count FROM companies;

-- Check employee response count (should be 219)
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
```

Expected results:
- Company 1: company1@test.com - should have responses
- Company 2: company2@test.com - should have responses
- Company 3: company3@test.com - should have responses

### Step 6: Update Sequence Counters (Important!)
After importing all data, update the sequence counters to prevent ID conflicts:

```sql
-- Set sequences to max ID + 1
SELECT setval('companies_id_seq', (SELECT MAX(id) FROM companies) + 1);
SELECT setval('employee_responses_id_seq', (SELECT MAX(id) FROM employee_responses) + 1);
```

## 📝 Files Created for This Migration
1. **production_migration.sql** - Contains the cleanup and company insertion SQL
2. **DATABASE_MIGRATION_GUIDE.md** - This guide you're reading

## ⚠️ Troubleshooting

### If you encounter "duplicate key" errors:
- Make sure to run the cleanup script first
- Check that sequences are properly reset

### If COPY command doesn't work:
- Try using the SQL export method instead
- Or export/import smaller batches

### If you need to rollback:
- Restore from your backup
- Or use Replit's checkpoint/rollback feature if available

## ✅ Migration Checklist
- [ ] Backed up production database
- [ ] Cleaned production tables
- [ ] Migrated 3 companies
- [ ] Migrated 219 employee responses
- [ ] Verified counts match development
- [ ] Updated sequence counters
- [ ] Tested application with production data

## 🆘 Need Help?
If you encounter any issues during the migration:
1. Check the error messages carefully
2. Verify you're in the correct database (Development vs Production)
3. Ensure all cleanup steps were completed before importing

Remember: This migration will **completely replace** all existing production data with development data. Make sure this is what you want before proceeding!