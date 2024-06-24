import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { Blog } from './blog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  providers: [BlogService, CloudinaryService],
  controllers: [BlogController],
  exports: [BlogService]
})
export class BlogModule { }
