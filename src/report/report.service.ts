import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { ReportCarDTO } from './dto/ReportCarDTO.dto';
import { User } from '../user/user.entity';
import { Car } from '../car/car.entity';
import { plainToInstance } from 'class-transformer';
import { GetReportDTO } from './dto/GetReportDTO.dto';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(Report)
        private reportRepo: Repository<Report>
    ) { }

    async countReport() {
        return await this.reportRepo.count()
    }

    async deleteReportByCarId(carId: number): Promise<Report[]> {
        let reports = await this.reportRepo.find({
            where: { car: { carId: carId } }
        })
        return await this.reportRepo.remove(reports)
    }

    async deleteReportByUserId(userId: number): Promise<Report[]> {
        let reports = await this.reportRepo.find({
            where: { user: { userId: userId } }
        })
        return await this.reportRepo.remove(reports)
    }

    async reportCar(body: ReportCarDTO): Promise<Report> {
        if (!body.carId || !body.userId || !body.reason) {
            throw new HttpException('Missing parameter', HttpStatus.BAD_REQUEST)
        }
        let user = new User
        user.userId = body.userId

        let car = new Car
        car.carId = body.carId

        let newReport = new Report
        newReport.user = user
        newReport.car = car
        newReport.reason = body.reason
        newReport.reportDate = new Date()

        return await this.reportRepo.save(newReport)
    }

    async getAllReports(): Promise<GetReportDTO[]> {
        let allReport = await this.reportRepo.find({
            relations: ['user', 'car', 'car.user']
        })
        if (!allReport || allReport.length === 0) {
            throw new HttpException("Dont have reports", HttpStatus.NO_CONTENT)
        }
        allReport = allReport.map(report => {
            if (report.car && report.car) {
                delete report.car.user.password
            }
            return report;
        });

        return allReport.map(report => {
            const reportDto = plainToInstance(GetReportDTO, report);
            return reportDto;
        });
    }

    async deleteReportById(reportId: number): Promise<Report> {
        let report = await this.reportRepo.findOne({
            where: { reportId: reportId }
        })
        if (!report) {
            throw new HttpException("No report in DB", HttpStatus.NO_CONTENT)
        }
        return await this.reportRepo.remove(report)
    }


}
