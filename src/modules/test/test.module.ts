import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestRepository } from './test.repository';
import { TestController } from './test.controller';
import { DynamoDBModule } from '../../database/supabase/supabase.module';

@Module({
  imports: [DynamoDBModule],
  controllers: [TestController],
  providers: [TestService, TestRepository],
})
export class TestModule {}
