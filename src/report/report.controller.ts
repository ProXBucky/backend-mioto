import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ReportService } from './report.service';
import { Report } from './report.entity';
import { ReportCarDTO } from './dto/ReportCarDTO.dto';

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    @Post()
    reportCar(@Body() body: ReportCarDTO): Promise<Report> {
        try {
            return this.reportService.reportCar(body)
        } catch (e) {
            throw new HttpException('Report car failed', HttpStatus.NOT_FOUND)
        }
    }
}
