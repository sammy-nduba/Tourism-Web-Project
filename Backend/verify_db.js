import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectDatabase() {
    console.log('Inspecting database schemas and tables...');

    // Query information_schema to find the tours table
    const { data: tables, error } = await supabase
        .rpc('get_table_info', {}, { count: 'exact' }); // This might not work if RPC isn't defined

    // Alternative: run a raw select on information_schema if enabled, 
    // but usually we don't have direct access via API.
    // Let's just try to select from public.tours via the client

    const { data: testData, error: testError } = await supabase
        .from('tours')
        .select('id')
        .limit(1);

    if (testError) {
        console.log('Error accessing "tours":', testError.message);
    } else {
        console.log('Successfully accessed "tours" table via API.');
    }

    // Check categories again
    const { data: colData, error: colError } = await supabase
        .from('tours')
        .select('*')
        .limit(1);

    if (colData && colData.length > 0) {
        console.log('Columns found:', Object.keys(colData[0]));
    }
}

inspectDatabase();
