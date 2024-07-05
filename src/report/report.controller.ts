import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { Report } from './report.entity';
import { ReportCarDTO } from './dto/ReportCarDTO.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetReportDTO } from './dto/GetReportDTO.dto';

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    reportCar(@Body() body: ReportCarDTO): Promise<Report> {
        try {
            return this.reportService.reportCar(body)
        } catch (e) {
            throw new HttpException('Report car failed', HttpStatus.NOT_FOUND)
        }
    }

    @Get("/all")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("Staff", "Admin")
    getAllReports(): Promise<GetReportDTO[]> {
        try {
            return this.reportService.getAllReports()
        } catch (e) {
            throw new HttpException('Report car failed', HttpStatus.NOT_FOUND)
        }
    }

    @Delete("/:reportId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("Staff", "Admin")
    deleteReviewById(@Param('reportId') reportId: number): Promise<Report> {
        try {
            return this.reportService.deleteReportById(reportId)
        } catch (e) {
            throw new HttpException('Delete report failed', HttpStatus.NOT_FOUND)
        }
    }


}
