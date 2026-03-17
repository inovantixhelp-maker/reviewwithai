
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aejcyhynrrkrrbjzidct.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlamN5aHlucnJrcnJianppZGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MzMwMzYsImV4cCI6MjA4NjIwOTAzNn0.XusNyJk0lCy3PFNS_2pbBsCb65OayUe8vfLOqb5M-cY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing connection to Supabase...');
    try {
        const { data, error } = await supabase.from('businesses').select('*').limit(1);
        if (error) {
            console.error('Error connecting to businesses table:', error.message);
            // Try another table or just auth check
            const { data: authData, error: authError } = await supabase.auth.getSession();
            if (authError) {
                console.error('Auth check failed:', authError.message);
            } else {
                console.log('Auth service reachable. Session:', authData.session ? 'Active' : 'None');
            }
        } else {
            console.log('Successfully connected to businesses table.');
            console.log('Data sample:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
