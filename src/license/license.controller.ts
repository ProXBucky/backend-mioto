import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { CreateLicenseDTO } from './dto/CreateLicenseDTO.dto';
import { LicenseService } from './license.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('license')
export class LicenseController {
    constructor(
        private readonly licenseService: LicenseService
    ) { }

    @Post('/:userId')
    @UseGuards(JwtAuthGuard)
    postLicense(@Param('userId') id: number, @Body() data: CreateLicenseDTO) {
        try {
            return this.licenseService.postLicense(id, data)
        } catch (e) {
            console.log(e)
            throw new HttpException('Post license fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Get('/:userId')
    @UseGuards(JwtAuthGuard)
    getLicenseByUserId(@Param('userId') id: number) {
        try {
            return this.licenseService.getLicenseByUserId(id)
        } catch (e) {
            console.log(e)
            throw new HttpException('Get license fail', HttpStatus.BAD_REQUEST)
        }
    }

}
