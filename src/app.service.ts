import { Injectable } from '@nestjs/common';
import { RentService } from './rent/rent.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AdminService } from './admin/admin.service';
import { UserService } from './user/user.service';
import { OwnerService } from './owner/owner.service';
import { BlogService } from './blog/blog.service';
import { VoucherService } from './voucher/voucher.service';
import { ReportService } from './report/report.service';
import { ReviewService } from './review/review.service';

@Injectable()
export class AppService {

  constructor(
    private readonly rentService: RentService,
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly ownService: OwnerService,
    private readonly blogService: BlogService,
    private readonly voucherService: VoucherService,
    private readonly reportService: ReportService,
    private readonly reviewService: ReviewService,

  ) { }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    console.log('Running cron job to update rent status');
    await this.rentService.updateRentStatus();
    await this.rentService.updateRentStatusFinish()
  }

  getHello(): string {
    return 'Hello World!';
  }

  async statistic() {
    let adminC = await this.adminService.countAdmin()
    let userC = await this.userService.countUser()
    let carC = await this.ownService.countCar()
    let rentC = await this.rentService.countRent()
    let blogC = await this.blogService.countBlog()
    let voucherC = await this.voucherService.countVoucher()
    let reportC = await this.reportService.countReport()
    let reviewC = await this.reviewService.countReview()
    return{
      adminCount: adminC,
      userCount: userC,
      carCount: carC,
      rentCount: rentC,
      blogCount: blogC,
      voucherCount: voucherC,
      reportCount: reportC,
      reviewCount: reviewC
    }

  }
}
