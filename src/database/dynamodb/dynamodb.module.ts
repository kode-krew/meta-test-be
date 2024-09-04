import { Module, Global } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Global()
@Module({
  providers: [
    {
      provide: 'SUPABASE',
      useFactory: () => {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_KEY;
        return createClient(supabaseUrl, supabaseKey);
      },
    },
  ],
  exports: ['SUPABASE'],
})
export class SupabaseModule {}
