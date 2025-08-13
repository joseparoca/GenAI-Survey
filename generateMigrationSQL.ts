#!/usr/bin/env tsx
/**
 * Database Migration SQL Generator
 * This script generates a complete SQL migration file from development to production
 */

import { Pool } from '@neondatabase/serverless';
import * as fs from 'fs';

// Helper function to escape SQL values
function escapeSQLValue(value: any): string {
  if (value === null || value === undefined) {
    return 'NULL';
  } else if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  } else if (typeof value === 'number') {
    return value.toString();
  } else if (typeof value === 'object') {
    // JSON values need special handling
    const jsonStr = JSON.stringify(value).replace(/'/g, "''");
    return `'${jsonStr}'::jsonb`;
  } else if (value instanceof Date) {
    return `'${value.toISOString()}'`;
  } else {
    // String values - escape single quotes
    const strValue = value.toString().replace(/'/g, "''");
    return `'${strValue}'`;
  }
}

async function generateMigrationSQL() {
  console.log('Database Migration SQL Generator');
  console.log('='.repeat(50));
  
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is not set');
    process.exit(1);
  }
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  try {
    // Export companies
    console.log('Exporting companies...');
    const companiesResult = await pool.query('SELECT * FROM companies ORDER BY id');
    const companies = companiesResult.rows;
    console.log(`  Found ${companies.length} companies`);
    
    // Export employee responses
    console.log('Exporting employee responses...');
    const responsesResult = await pool.query('SELECT * FROM employee_responses ORDER BY id');
    const responses = responsesResult.rows;
    console.log(`  Found ${responses.length} employee responses`);
    
    // Generate SQL
    console.log('\nGenerating migration SQL...');
    
    const sqlLines: string[] = [];
    
    // Header
    sqlLines.push('-- =========================================');
    sqlLines.push('-- PRODUCTION DATABASE MIGRATION SCRIPT');
    sqlLines.push(`-- Generated on: ${new Date().toISOString()}`);
    sqlLines.push(`-- Total Companies: ${companies.length}`);
    sqlLines.push(`-- Total Employee Responses: ${responses.length}`);
    sqlLines.push('-- =========================================');
    sqlLines.push('');
    sqlLines.push('-- WARNING: This will DELETE all existing production data!');
    sqlLines.push('-- Make sure to backup production data before running this script.');
    sqlLines.push('');
    
    // Step 1: Clean up
    sqlLines.push('-- Step 1: Clean up existing production data');
    sqlLines.push('-- =========================================');
    sqlLines.push('BEGIN;');
    sqlLines.push('');
    sqlLines.push('-- Delete all employee responses first (due to foreign key constraints)');
    sqlLines.push('DELETE FROM employee_responses;');
    sqlLines.push('');
    sqlLines.push('-- Delete all companies');
    sqlLines.push('DELETE FROM companies;');
    sqlLines.push('');
    sqlLines.push('COMMIT;');
    sqlLines.push('');
    
    // Step 2: Insert companies
    sqlLines.push('-- Step 2: Insert companies data from development');
    sqlLines.push('-- =========================================');
    sqlLines.push('BEGIN;');
    sqlLines.push('');
    
    if (companies.length > 0) {
      const columns = Object.keys(companies[0]);
      const columnsStr = columns.join(', ');
      
      sqlLines.push(`INSERT INTO companies (${columnsStr}) VALUES`);
      
      companies.forEach((company, i) => {
        const values = columns.map(col => escapeSQLValue(company[col]));
        const valuesStr = values.join(', ');
        
        if (i < companies.length - 1) {
          sqlLines.push(`(${valuesStr}),`);
        } else {
          sqlLines.push(`(${valuesStr});`);
        }
      });
    }
    
    sqlLines.push('');
    sqlLines.push('COMMIT;');
    sqlLines.push('');
    
    // Step 3: Insert employee responses in batches
    sqlLines.push('-- Step 3: Insert employee_responses data from development');
    sqlLines.push('-- =========================================');
    sqlLines.push('-- Inserting in batches of 50 records to avoid transaction size limits');
    sqlLines.push('');
    
    if (responses.length > 0) {
      const columns = Object.keys(responses[0]);
      const columnsStr = columns.join(', ');
      
      // Process in batches of 50
      const batchSize = 50;
      for (let batchNum = 0; batchNum < responses.length; batchNum += batchSize) {
        const batch = responses.slice(batchNum, batchNum + batchSize);
        
        sqlLines.push(`-- Batch ${Math.floor(batchNum / batchSize) + 1}`);
        sqlLines.push('BEGIN;');
        sqlLines.push('');
        sqlLines.push(`INSERT INTO employee_responses (${columnsStr}) VALUES`);
        
        batch.forEach((response, i) => {
          const values = columns.map(col => escapeSQLValue(response[col]));
          const valuesStr = values.join(', ');
          
          if (i < batch.length - 1) {
            sqlLines.push(`(${valuesStr}),`);
          } else {
            sqlLines.push(`(${valuesStr});`);
          }
        });
        
        sqlLines.push('');
        sqlLines.push('COMMIT;');
        sqlLines.push('');
      }
    }
    
    // Verification queries
    sqlLines.push('-- =========================================');
    sqlLines.push('-- VERIFICATION QUERIES');
    sqlLines.push('-- =========================================');
    sqlLines.push('-- After running the migration, verify the data:');
    sqlLines.push('');
    sqlLines.push('-- Check company count (should be ' + companies.length + ')');
    sqlLines.push('SELECT COUNT(*) as company_count FROM companies;');
    sqlLines.push('');
    sqlLines.push('-- Check employee response count (should be ' + responses.length + ')');
    sqlLines.push('SELECT COUNT(*) as response_count FROM employee_responses;');
    sqlLines.push('');
    sqlLines.push('-- Check responses per company');
    sqlLines.push('SELECT ');
    sqlLines.push('    c.id,');
    sqlLines.push('    c.email,');
    sqlLines.push('    c.access_code,');
    sqlLines.push('    COUNT(er.id) as response_count');
    sqlLines.push('FROM companies c');
    sqlLines.push('LEFT JOIN employee_responses er ON c.id = er.company_id');
    sqlLines.push('GROUP BY c.id, c.email, c.access_code');
    sqlLines.push('ORDER BY c.id;');
    sqlLines.push('');
    sqlLines.push('-- =========================================');
    sqlLines.push('-- END OF MIGRATION SCRIPT');
    sqlLines.push('-- =========================================');
    
    const migrationSQL = sqlLines.join('\n');
    
    // Save to file
    const outputFile = 'production_migration_complete.sql';
    fs.writeFileSync(outputFile, migrationSQL);
    
    console.log(`\n✓ Migration SQL saved to: ${outputFile}`);
    console.log(`  File size: ${migrationSQL.length.toLocaleString()} characters`);
    console.log('\nNext steps:');
    console.log('1. Review the generated SQL file');
    console.log('2. Backup your production database');
    console.log('3. Open the Replit Database pane');
    console.log('4. Switch to the Production database');
    console.log('5. Copy and execute the SQL from production_migration_complete.sql');
    console.log('6. Run the verification queries to confirm the migration');
    
    await pool.end();
    
  } catch (error) {
    console.error('\n✗ Error:', error);
    process.exit(1);
  }
}

// Run the script
generateMigrationSQL().catch(console.error);