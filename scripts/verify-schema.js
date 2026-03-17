
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env.local manually since dotenv doesn't do it by default for specific files
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const tables = [
    'profiles',
    'businesses',
    'plans',
    'coupons',
    'feedbacks',
    'tickets',
    'ticket_messages',
    'transactions',
    'global_settings',
    'live_messages'
];

async function checkTable(table) {
    // Select 1 row. If table doesn't exist, it should error.
    const { data, error } = await supabase.from(table).select('count').limit(1);

    if (error) {
        if (error.code === '42P01') { // undefined_table
            return { table, status: 'MISSING', message: 'Table does not exist' };
        }
        return { table, status: 'ERROR', message: error.message };
    }
    return { table, status: 'OK', message: 'Accessible' };
}

async function verify() {
    console.log('Verifying Supabase Schema...');
    const results = await Promise.all(tables.map(checkTable));

    console.table(results);

    const issues = results.filter(r => r.status !== 'OK');
    if (issues.length > 0) {
        console.error('\nCRITICAL: There are issues with your Supabase schema:');
        issues.forEach(m => console.log(` - ${m.table}: ${m.message}`));
        console.log('\nPlease ensure you have run the SQL in "supabase_schema.sql" in your Supabase SQL Editor.');
    } else {
        console.log('\nSUCCESS: All tables are present and accessible.');
    }
}

verify();
