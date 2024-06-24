import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { Report } from './report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Report])],
    providers: [ReportService],
    controllers: [ReportController],
    exports: [ReportService]
})
export class ReportModule { }
