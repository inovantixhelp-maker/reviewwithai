
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aejcyhynrrkrrbjzidct.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlamN5aHlucnJrcnJianppZGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MzMwMzYsImV4cCI6MjA4NjIwOTAzNn0.XusNyJk0lCy3PFNS_2pbBsCb65OayUe8vfLOqb5M-cY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserExists() {
    console.log('Trying to sign in to check if user exists in Auth...');
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'inovantix.help@gmail.com',
        password: '!@#$%^&*()_+',
    });

    if (error) {
        console.log('Auth Error:', error.message);
    } else {
        console.log('Success! User exists in Auth.');
        console.log('User ID:', data.user.id);

        // Check if profile exists
        const { data: profile, error: pError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (pError) {
            console.log('Profile Missing or Error:', pError.message);
        } else {
            console.log('Profile found:', profile);
        }
    }
}

checkUserExists();
