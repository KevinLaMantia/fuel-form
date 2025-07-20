#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '..', 'scripts')
  const migrationFiles = [
    'create-enhanced-waitlist-v2.sql',
    'update-waitlist-with-sample-data.sql'
  ]
  
  console.log('🗄️  Running database migrations...')
  
  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file)
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Migration file not found: ${file}`)
      continue
    }
    
    try {
      const sql = fs.readFileSync(filePath, 'utf8')
      console.log(`⏳ Running migration: ${file}`)
      
      const { error } = await supabase.rpc('exec_sql', { sql })
      
      if (error) {
        console.error(`❌ Migration failed: ${file}`, error)
        process.exit(1)
      }
      
      console.log(`✅ Migration completed: ${file}`)
    } catch (error) {
      console.error(`❌ Error reading migration file: ${file}`, error)
      process.exit(1)
    }
  }
  
  console.log('🎉 All migrations completed successfully!')
}

runMigrations().catch(console.error)