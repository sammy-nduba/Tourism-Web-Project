import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  try {
    console.log('Setting up storage buckets...');

    // Create tour-images bucket
    const { data: tourImagesBucket, error: tourImagesError } = await supabase.storage.createBucket('tour-images', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
    });

    if (tourImagesError) {
      if (tourImagesError.message.includes('already exists')) {
        console.log('✓ tour-images bucket already exists');
      } else {
        throw tourImagesError;
      }
    } else {
      console.log('✓ tour-images bucket created successfully');
    }

    console.log('\n✅ Storage setup complete!');
  } catch (error) {
    console.error('❌ Storage setup failed:', error);
    process.exit(1);
  }
}

setupStorage();
