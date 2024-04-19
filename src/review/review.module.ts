import { Module } from '@nestjs/common';
import { ReviewService } from './review/review.service';
import { ReportService } from './report/report.service';
import { ReviewController } from './review/review.controller';
import { ReportController } from './report/report.controller';

@Module({
  providers: [ReviewService, ReportService],
  controllers: [ReviewController, ReportController]
})
export class ReviewModule {}
