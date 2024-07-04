import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';
import { CreateBlogDTO } from './dto/CreateBlogDTO.dto';
import { Admin } from '../admin/admin.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(Blog)
        private blogRepository: Repository<Blog>,

        private cloudinaryService: CloudinaryService
    ) { }

    async countBlog() {
        return await this.blogRepository.count()
    }

    async createNewBlog(blog: CreateBlogDTO): Promise<Blog> {
        let admin = new Admin
        admin.adminId = blog.adminId
        let blogs = new Blog
        blogs.admin = admin
        blogs.title = blog.title
        blogs.content = blog.content
        blogs.isPublished = true
        blogs.publishDate = new Date()
        let response = await this.cloudinaryService.uploadImageTitleBlog(blog.imageTitle)
        if (response && response.public_id && response.secure_url) {
            blogs.imageTitle = response.secure_url
            blogs.imageTitleId = response.public_id
        }
        return this.blogRepository.save(blogs);
    }


    async getAllBlogs(): Promise<Blog[]> {
        let blogs = await this.blogRepository.find({
            relations: ['admin'],
            order: {
                publishDate: "ASC"
            }
        })
        if (!blogs || blogs.length === 0) {
            throw new HttpException("No Blog", HttpStatus.NO_CONTENT)
        }
        return blogs;
    }

    async getAllBlogsWithLimit(limit: number): Promise<Blog[]> {
        let blogs = await this.blogRepository.find({
            take: limit,
            order: {
                publishDate: "DESC"
            }
        })
        if (!blogs || blogs.length === 0) {
            throw new HttpException("No Blog", HttpStatus.NO_CONTENT)
        }
        return blogs;
    }



    async getOneBlog(id: number): Promise<Blog> {
        let blog = this.blogRepository.findOne({
            relations: ['admin'],
            where: { blogId: id }
        });
        if (!blog) {
            throw new HttpException("Blog not found", HttpStatus.NO_CONTENT)
        }
        return blog
    }

    async updateBlog(id: number, blog: CreateBlogDTO): Promise<Blog> {
        let blogFind = await this.blogRepository.findOne({
            where: { blogId: id }
        });
        if (!blogFind) {
            throw new HttpException("Blog not found", HttpStatus.NO_CONTENT)
        }
        blogFind.title = blog.title
        blogFind.content = blog.content
        if (blog.imageTitle) {
            let res = await this.cloudinaryService.deleteImage(blogFind.imageTitleId)
            if (res) {
                let response = await this.cloudinaryService.uploadImageTitleBlog(blog.imageTitle)
                if (response && response.public_id && response.secure_url) {
                    blogFind.imageTitle = response.secure_url
                    blogFind.imageTitleId = response.public_id
                }
            }
        }
        return await this.blogRepository.save(blogFind);
    }

    async deleteBlog(id: number): Promise<Blog> {
        let blogFind = await this.blogRepository.findOne({
            where: { blogId: id }
        });
        if (!blogFind) {
            throw new HttpException("Blog not found", HttpStatus.NO_CONTENT)
        }
        await this.cloudinaryService.deleteImage(blogFind.imageTitleId)
        return await this.blogRepository.remove(blogFind);
    }

    async deleteBlogByAdminId(adminId: number): Promise<Blog[]> {
        let res = await this.blogRepository.find({ where: { admin: { adminId: adminId } } })
        if (res && res.length > 0) {
            const imageLinkIDs = res.map(item => item.imageTitleId);
            await this.cloudinaryService.deleteMultiImages(imageLinkIDs)
            return await this.blogRepository.remove(res)
        }
    }


}
