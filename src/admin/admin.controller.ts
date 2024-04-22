import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDTO } from './dto/CreateAdminDto.dto';
import { Admin } from './admin.entity';
import { UpdateAdminDTO } from './dto/UpdateAdminDTO.dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    createNewAdmin(@Body() data: CreateAdminDTO): Promise<Admin> {
        try {
            return this.adminService.createNewAdmin(data)
        } catch (e) {
            console.log(e)
            throw new HttpException('Create admin fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Get()
    findAll(): Promise<Admin[]> {
        try {
            return this.adminService.findAll()
        } catch (e) {
            console.log(e)
            throw new HttpException('Find all admin fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Get("/:adminId")
    findOneByAdminId(@Param('adminId') id: number): Promise<Admin> {
        try {
            return this.adminService.findOneByAdminId(id)
        } catch (e) {
            console.log(e)
            throw new HttpException('Find admin fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Put("/:adminId")
    editAdmin(@Param('adminId') id: number, @Body() updateAdmin: UpdateAdminDTO): Promise<Admin> {
        try {
            return this.adminService.editAdmin(id, updateAdmin)
        } catch (e) {
            console.log(e)
            throw new HttpException('Edit admin fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Delete("/:adminId")
    deleteAdmin(@Param('adminId') id: number): Promise<Admin> {
        try {
            return this.adminService.deleteAdmin(id)
        } catch (e) {
            console.log(e)
            throw new HttpException('Delete admin fail', HttpStatus.BAD_REQUEST)
        }
    }
}
