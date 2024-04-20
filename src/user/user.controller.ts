import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/CreateUserDTO.dto';
import { UpdateUserDTO } from './dto/UpdateUserDTO.dto';
import { User } from './user.entity';

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
    findAll(): Promise<User[]> {
        try {
            return this.userService.findAll()
        } catch (e) {
            console.log(e)
            throw new HttpException('Find all user fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Get("/:userId")
    findOneByUserId(@Param('userId') id: number): Promise<User> {
        try {
            return this.userService.findOneByUserId(id)
        } catch (e) {
            console.log(e)
            throw new HttpException('Find user fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Put("/:userId")
    editUser(@Param('userId') id: number, @Body() updateUser: UpdateUserDTO): Promise<User> {
        try {
            return this.userService.editUser(id, updateUser)
        } catch (e) {
            console.log(e)
            throw new HttpException('Edit all user fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Delete("/:userId")
    deleteUser(@Param('userId') id: number): Promise<User> {
        try {
            return this.userService.deleteUser(id)
        } catch (e) {
            console.log(e)
            throw new HttpException('Delete user fail', HttpStatus.BAD_REQUEST)
        }
    }

}
