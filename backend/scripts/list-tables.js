// Quick script to list tables in the connected Postgres database using Prisma
// Usage: node scripts/list-tables.js (will load .env automatically)
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main(){
  try{
    const res = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    if(!res || res.length === 0) {
      console.log('No tables found in schema "public"')
    } else {
      console.log('Tables in public schema:')
      res.forEach(r => console.log('-', r.table_name || r.table_name))
    }
  } catch (e) {
    console.error('Error querying tables:', e.message || e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
