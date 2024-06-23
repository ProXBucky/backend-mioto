import { Injectable } from '@nestjs/common';
import { RentService } from './rent/rent.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppService {

  constructor(private readonly rentService: RentService) { }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    console.log('Running cron job to update rent status');
    await this.rentService.updateRentStatus();
    await this.rentService.updateRentStatusFinish()
  }

  getHello(): string {
    return 'Hello World!';
  }
}
