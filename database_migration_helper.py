#!/usr/bin/env python3
"""
Database Migration Helper Script
This script helps export development data and prepare it for production migration.

Usage:
1. Run this script to generate the complete migration SQL file
2. Copy the generated SQL to your production database interface
3. Execute the SQL in production

Note: This script requires the DATABASE_URL environment variable to be set.
"""

import os
import json
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Create a database connection using the DATABASE_URL."""
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        raise ValueError("DATABASE_URL environment variable is not set")
    return psycopg2.connect(db_url, cursor_factory=RealDictCursor)

def escape_sql_value(value):
    """Properly escape SQL values for insertion."""
    if value is None:
        return 'NULL'
    elif isinstance(value, bool):
        return 'true' if value else 'false'
    elif isinstance(value, (int, float)):
        return str(value)
    elif isinstance(value, dict) or isinstance(value, list):
        # JSON values need special handling
        json_str = json.dumps(value)
        # Escape single quotes in JSON
        json_str = json_str.replace("'", "''")
        return f"'{json_str}'"
    elif isinstance(value, datetime):
        return f"'{value.isoformat()}'"
    else:
        # String values - escape single quotes
        str_value = str(value).replace("'", "''")
        return f"'{str_value}'"

def export_companies(conn):
    """Export all companies data."""
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM companies ORDER BY id")
        return cursor.fetchall()

def export_employee_responses(conn):
    """Export all employee responses data."""
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM employee_responses ORDER BY id")
        return cursor.fetchall()

def generate_migration_sql(companies, responses):
    """Generate the complete migration SQL script."""
    sql_lines = []
    
    # Header
    sql_lines.append("-- =========================================")
    sql_lines.append("-- PRODUCTION DATABASE MIGRATION SCRIPT")
    sql_lines.append(f"-- Generated on: {datetime.now().isoformat()}")
    sql_lines.append(f"-- Total Companies: {len(companies)}")
    sql_lines.append(f"-- Total Employee Responses: {len(responses)}")
    sql_lines.append("-- =========================================")
    sql_lines.append("")
    sql_lines.append("-- WARNING: This will DELETE all existing production data!")
    sql_lines.append("-- Make sure to backup production data before running this script.")
    sql_lines.append("")
    
    # Step 1: Clean up
    sql_lines.append("-- Step 1: Clean up existing production data")
    sql_lines.append("-- =========================================")
    sql_lines.append("BEGIN;")
    sql_lines.append("")
    sql_lines.append("-- Delete all employee responses first (due to foreign key constraints)")
    sql_lines.append("DELETE FROM employee_responses;")
    sql_lines.append("")
    sql_lines.append("-- Delete all companies")
    sql_lines.append("DELETE FROM companies;")
    sql_lines.append("")
    sql_lines.append("COMMIT;")
    sql_lines.append("")
    
    # Step 2: Insert companies
    sql_lines.append("-- Step 2: Insert companies data from development")
    sql_lines.append("-- =========================================")
    sql_lines.append("BEGIN;")
    sql_lines.append("")
    
    if companies:
        # Get column names from first record
        columns = list(companies[0].keys())
        columns_str = ", ".join(columns)
        
        sql_lines.append(f"INSERT INTO companies ({columns_str}) VALUES")
        
        for i, company in enumerate(companies):
            values = []
            for col in columns:
                values.append(escape_sql_value(company[col]))
            values_str = ", ".join(values)
            
            # Add comma for all except last record
            if i < len(companies) - 1:
                sql_lines.append(f"({values_str}),")
            else:
                sql_lines.append(f"({values_str});")
    
    sql_lines.append("")
    sql_lines.append("COMMIT;")
    sql_lines.append("")
    
    # Step 3: Insert employee responses in batches
    sql_lines.append("-- Step 3: Insert employee_responses data from development")
    sql_lines.append("-- =========================================")
    sql_lines.append("-- Inserting in batches of 50 records to avoid transaction size limits")
    sql_lines.append("")
    
    if responses:
        # Get column names from first record
        columns = list(responses[0].keys())
        columns_str = ", ".join(columns)
        
        # Process in batches of 50
        batch_size = 50
        for batch_num in range(0, len(responses), batch_size):
            batch = responses[batch_num:batch_num + batch_size]
            
            sql_lines.append(f"-- Batch {batch_num // batch_size + 1}")
            sql_lines.append("BEGIN;")
            sql_lines.append("")
            sql_lines.append(f"INSERT INTO employee_responses ({columns_str}) VALUES")
            
            for i, response in enumerate(batch):
                values = []
                for col in columns:
                    values.append(escape_sql_value(response[col]))
                values_str = ", ".join(values)
                
                # Add comma for all except last record in batch
                if i < len(batch) - 1:
                    sql_lines.append(f"({values_str}),")
                else:
                    sql_lines.append(f"({values_str});")
            
            sql_lines.append("")
            sql_lines.append("COMMIT;")
            sql_lines.append("")
    
    # Verification queries
    sql_lines.append("-- =========================================")
    sql_lines.append("-- VERIFICATION QUERIES")
    sql_lines.append("-- =========================================")
    sql_lines.append("-- After running the migration, verify the data:")
    sql_lines.append("")
    sql_lines.append("-- Check company count")
    sql_lines.append("SELECT COUNT(*) as company_count FROM companies;")
    sql_lines.append("")
    sql_lines.append("-- Check employee response count")
    sql_lines.append("SELECT COUNT(*) as response_count FROM employee_responses;")
    sql_lines.append("")
    sql_lines.append("-- Check responses per company")
    sql_lines.append("SELECT ")
    sql_lines.append("    c.id,")
    sql_lines.append("    c.email,")
    sql_lines.append("    c.access_code,")
    sql_lines.append("    COUNT(er.id) as response_count")
    sql_lines.append("FROM companies c")
    sql_lines.append("LEFT JOIN employee_responses er ON c.id = er.company_id")
    sql_lines.append("GROUP BY c.id, c.email, c.access_code")
    sql_lines.append("ORDER BY c.id;")
    sql_lines.append("")
    sql_lines.append("-- =========================================")
    sql_lines.append("-- END OF MIGRATION SCRIPT")
    sql_lines.append("-- =========================================")
    
    return "\n".join(sql_lines)

def main():
    """Main function to export data and generate migration SQL."""
    print("Database Migration Helper")
    print("=" * 50)
    
    try:
        # Connect to database
        print("Connecting to development database...")
        conn = get_db_connection()
        
        # Export data
        print("Exporting companies...")
        companies = export_companies(conn)
        print(f"  Found {len(companies)} companies")
        
        print("Exporting employee responses...")
        responses = export_employee_responses(conn)
        print(f"  Found {len(responses)} employee responses")
        
        # Generate SQL
        print("\nGenerating migration SQL...")
        migration_sql = generate_migration_sql(companies, responses)
        
        # Save to file
        output_file = "production_migration_complete.sql"
        with open(output_file, 'w') as f:
            f.write(migration_sql)
        
        print(f"\n✓ Migration SQL saved to: {output_file}")
        print(f"  File size: {len(migration_sql):,} characters")
        print("\nNext steps:")
        print("1. Review the generated SQL file")
        print("2. Backup your production database")
        print("3. Copy the SQL content to your production database interface")
        print("4. Execute the SQL in production")
        print("5. Run the verification queries to confirm the migration")
        
        # Close connection
        conn.close()
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())