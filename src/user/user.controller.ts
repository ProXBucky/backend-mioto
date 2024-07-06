import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/CreateUserDTO.dto';
import { UpdateUserDTO } from './dto/UpdateUserDTO.dto';
import { User } from './user.entity';
import { ChangePasswordDTO } from './dto/ChangePasswordDTO.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { GetUserNotPasswordDTO } from './dto/GetUserNotPasswordDTO.dto';
import { BACKEND_PORT } from '../config';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    createNewUser(@Body() data: CreateUserDTO): Promise<User> {
        try {
            return this.userService.createNewUser(data)
        } catch (e) {
            console.log(e)
            throw new HttpException('Create user fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Staff', 'Admin')
    async findAllPaginated(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ): Promise<Pagination<GetUserNotPasswordDTO>> {
        try {
            const options = {
                page,
                limit,
                route: `http://localhost:${BACKEND_PORT}/user`,
            };
            return await this.userService.findAllPaginated(options);
        } catch (e) {
            console.log(e);
            throw new HttpException('Find all users failed', HttpStatus.BAD_REQUEST);
        }
    }

    @Get("/get-all-by-admin")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Staff', 'Admin')
    async findAlls(): Promise<GetUserNotPasswordDTO[]> {
        try {
            return await this.userService.findAlls();
        } catch (e) {
            console.log(e);
            throw new HttpException('Find all users failed', HttpStatus.BAD_REQUEST);
        }
    }

    @Get("/:userId")
    @UseGuards(JwtAuthGuard)
    findOneByUserId(@Param('userId') id: number): Promise<User> {
        try {
            return this.userService.findOneByUserId(id)
        } catch (e) {
            console.log(e)
            throw new HttpException('Find user fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Put("/:userId")
    @UseGuards(JwtAuthGuard)
    editUser(@Param('userId') id: number, @Body() updateUser: UpdateUserDTO): Promise<User> {
        try {
            return this.userService.editUser(id, updateUser)
        } catch (e) {
            console.log(e)
            throw new HttpException('Edit all user fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Delete("/:userId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin')
    deleteUser(@Param('userId') id: number): Promise<User> {
        try {
            return this.userService.deleteUser(id)
        } catch (e) {
            console.log(e)
            throw new HttpException('Delete user fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Put("change-password/:userId")
    @UseGuards(JwtAuthGuard)
    changePassword(@Param('userId') id: number, @Body() data: ChangePasswordDTO): Promise<User> {
        try {
            return this.userService.changePassword(id, data)
        } catch (e) {
            console.log(e)
            throw new HttpException('Change password fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Put("/admin-role/change-password")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Staff', 'Admin')
    changePasswordByAdmin(@Body() data: { userId: number, password: string }): Promise<User> {
        try {
            return this.userService.changePasswordByAdmin(data.userId, data.password)
        } catch (e) {
            throw new HttpException('Change password fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Post("/admin-role/create-new-user")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Staff', 'Admin')
    @UsePipes(new ValidationPipe())
    createNewUserByAdmin(@Body() data: User): Promise<User> {
        try {
            return this.userService.createNewUserByAdmin(data)
        } catch (e) {
            console.log(e)
            throw new HttpException('Create user fail', HttpStatus.BAD_REQUEST)
        }
    }


}
