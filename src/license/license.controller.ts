import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { CreateLicenseDTO } from './dto/CreateLicenseDTO.dto';
import { LicenseService } from './license.service';

@Controller('license')
export class LicenseController {
    constructor(
        private readonly licenseService: LicenseService
    ) { }

    @Post('/:userId')
    postLicense(@Param('userId') id: number, @Body() data: CreateLicenseDTO) {
        try {
            return this.licenseService.postLicense(id, data)
        } catch (e) {
            console.log(e)
            throw new HttpException('Post license fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Get('/:userId')
    getLicenseByUserId(@Param('userId') id: number) {
        try {
            return this.licenseService.getLicenseByUserId(id)
        } catch (e) {
            console.log(e)
            throw new HttpException('Get license fail', HttpStatus.BAD_REQUEST)
        }
    }

}
