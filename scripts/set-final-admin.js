
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aejcyhynrrkrrbjzidct.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlamN5aHlucnJrcnJianppZGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MzMwMzYsImV4cCI6MjA4NjIwOTAzNn0.XusNyJk0lCy3PFNS_2pbBsCb65OayUe8vfLOqb5M-cY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function setFinalAdmin() {
    const adminEmail = 'inovantix.help@gmail.com';
    console.log(`Setting ${adminEmail} as the final ADMIN...`);

    // 1. Update the role to ADMIN for our target user
    const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'ADMIN' })
        .eq('email', adminEmail)
        .select();

    if (updateError) {
        console.error('Error updating role:', updateError.message);
    } else if (!updateData || updateData.length === 0) {
        console.error(`User with email ${adminEmail} not found in profiles table. Please make sure you registered!`);
    } else {
        console.log('Update Successful! Profile details:', updateData[0]);
    }

    // 2. Double check state
    const { data: allProfiles, error: listError } = await supabase.from('profiles').select('email, role');
    if (!listError) {
        console.log('\nCurrent Profiles Status:');
        console.table(allProfiles);
    }
}

setFinalAdmin();
