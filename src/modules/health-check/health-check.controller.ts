import { Controller, Get } from '@nestjs/common';

@Controller('health-check')
export class HealthCheckController {
  @Get()
  async checkHealth() {
    // TODO: check database status if needed
    return {status: 'ok'};
  }
}