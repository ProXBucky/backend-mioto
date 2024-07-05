import { Injectable } from '@nestjs/common';
import { RentService } from './rent/rent.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AdminService } from './admin/admin.service';
import { UserService } from './user/user.service';
import { BlogService } from './blog/blog.service';
import { VoucherService } from './voucher/voucher.service';
import { ReportService } from './report/report.service';
import { ReviewService } from './review/review.service';
import { CarService } from './car/car.service';

@Injectable()
export class AppService {

  constructor(
    private readonly rentService: RentService,
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly carService: CarService,
    private readonly blogService: BlogService,
    private readonly voucherService: VoucherService,
    private readonly reportService: ReportService,
    private readonly reviewService: ReviewService,

  ) { }

  // @Cron(CronExpression.EVERY_MINUTE)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    console.log('Running cron job to update rent status');
    await this.rentService.updateRentStatus();
    await this.rentService.updateRentStatusFinish()
    await this.rentService.updateRentStatusCancel()
  }

  async statistic() {
    let adminC = await this.adminService.countAdmin()
    let userC = await this.userService.countUser()
    let carC = await this.carService.countCar()
    let rentC = await this.rentService.countRent()
    let blogC = await this.blogService.countBlog()
    let voucherC = await this.voucherService.countVoucher()
    let reportC = await this.reportService.countReport()
    let reviewC = await this.reviewService.countReview()
    let chartStatus = await this.rentService.getRentStatusCounts()
    let res1 = await this.rentService.getRentCountByBrand()
    let res = await this.carService.getCarCountByBrand()
    return {
      adminCount: adminC,
      userCount: userC,
      carCount: carC,
      rentCount: rentC,
      blogCount: blogC,
      voucherCount: voucherC,
      reportCount: reportC,
      reviewCount: reviewC,
      chartStatus: chartStatus,
      res: res,
      res1: res1
    }

  }
}
