import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Blog } from './blog.entity';
import { CreateBlogDTO } from './dto/CreateBlogDTO.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("Admin", "Staff")
    createNewBlog(@Body() blog: CreateBlogDTO): Promise<Blog> {
        try {
            return this.blogService.createNewBlog(blog);
        } catch (e) {
            console.log(e)
            throw new HttpException('create blog fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Get()
    getAllBlogs(): Promise<Blog[]> {
        return this.blogService.getAllBlogs();
    }

    @Get("/limit/:limit")
    getAllBlogsWithLimit(@Param("limit") limit: number): Promise<Blog[]> {
        return this.blogService.getAllBlogsWithLimit(limit);
    }

    @Get('/:blogId')
    getOneBlog(@Param('blogId') blogId: number): Promise<Blog> {
        return this.blogService.getOneBlog(+blogId);
    }


    @Put('/:blogId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("Admin", "Staff")
    updateBlog(@Param('blogId') blogId: number, @Body() blog: CreateBlogDTO): Promise<Blog> {
        return this.blogService.updateBlog(+blogId, blog);
    }

    @Delete('/:blogId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("Admin")
    deleteBlog(@Param('blogId') blogId: number): Promise<Blog> {
        return this.blogService.deleteBlog(+blogId);
    }
}
