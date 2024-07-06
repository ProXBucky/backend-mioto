import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDTO } from './dto/CreateAdminDto.dto';
import { Admin } from './admin.entity';
import { UpdateAdminDTO } from './dto/UpdateAdminDTO.dto';
import { GetAdminDTO } from './dto/GetAdminDTO.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Pagination } from 'nestjs-typeorm-paginate';
import { BACKEND_PORT } from '../config';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin')
    createNewAdmin(@Body() data: Admin): Promise<Admin> {
        try {
            return this.adminService.createNewAdmin(data)
        } catch (e) {
            console.log(e)
            throw new HttpException('Create admin fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Staff', 'Admin')
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ): Promise<Pagination<GetAdminDTO>> {
        try {
            const options = {
                page,
                limit,
                route: `http://localhost:${BACKEND_PORT}/admin`,
            };
            return await this.adminService.findAll(options);
        } catch (e) {
            console.log(e);
            throw new HttpException('Find all users failed', HttpStatus.BAD_REQUEST);
        }
    }

    @Get("/:adminId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Staff', 'Admin')
    findOneByAdminId(@Param('adminId') id: number): Promise<GetAdminDTO> {
        try {
            return this.adminService.findOneByAdminId(id)
        } catch (e) {
            console.log(e)
            throw new HttpException('Find admin fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Put("/:adminId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin')
    editAdmin(@Param('adminId') id: number, @Body() updateAdmin: UpdateAdminDTO): Promise<Admin> {
        try {
            return this.adminService.editAdmin(id, updateAdmin)
        } catch (e) {
            console.log(e)
            throw new HttpException('Edit admin fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Delete("/:adminId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin')
    deleteAdmin(@Param('adminId') id: number): Promise<Admin> {
        try {
            return this.adminService.deleteAdmin(id)
        } catch (e) {
            console.log(e)
            throw new HttpException('Delete admin fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Put("/action/change-password")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin')
    changePasswordByAdmin(@Body() data: { userId: number, password: string }): Promise<Admin> {
        try {
            return this.adminService.changePasswordByAdmin(data.userId, data.password)
        } catch (e) {
            throw new HttpException('Change password fail', HttpStatus.BAD_REQUEST)
        }
    }
}
