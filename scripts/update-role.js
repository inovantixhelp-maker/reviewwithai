
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aejcyhynrrkrrbjzidct.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlamN5aHlucnJrcnJianppZGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MzMwMzYsImV4cCI6MjA4NjIwOTAzNn0.XusNyJk0lCy3PFNS_2pbBsCb65OayUe8vfLOqb5M-cY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateRole() {
    console.log('Updating role for shivam@gmail.com to ADMIN...');
    const { data, error } = await supabase
        .from('profiles')
        .update({ role: 'ADMIN' })
        .eq('email', 'shivam@gmail.com')
        .select();

    if (error) {
        console.error('Error updating role:', error.message);
    } else {
        console.log('Update successful:', data);
    }
}

updateRole();
