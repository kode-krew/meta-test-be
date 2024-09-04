import { Module } from '@nestjs/common';
import { HealthCheckController } from './modules/health-check/health-check.controller';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TestModule } from './modules/test/test.module';
import { SupabaseModule } from './database/supabase/supabase.module';
@Module({
  imports: [SupabaseModule, UserModule, AuthModule, TestModule],
  controllers: [HealthCheckController],
  providers: [],
})
export class AppModule {}
