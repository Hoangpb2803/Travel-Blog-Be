import { Body, Controller, Get, Param, Post, Query, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { BlogDto } from 'src/dtos/blog.dto';
import { BlogService } from './blog.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthGuard } from 'src/guards/verify_token.guard';
import { Request as ExpressRequest } from 'express';

@Controller('blog')
export class BlogController {
    constructor(
        private readonly blogService: BlogService,
        private readonly cloudinatyService: CloudinaryService
    ) { }

    @Get()
    getAllBlogs(@Query('page') page: number) {
        return this.blogService.getAllBlogs(page)
    }

    @UseGuards(AuthGuard)
    @Get('user')
    getBlogsWhenLogin(
        @Query('page') page: number,
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']
        return this.blogService.getBlogsWhenLogin(_id, page)
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    getBlogDetail(
        @Param('id') _id: string
    ) {
        return this.blogService.getBlogDetail(_id)
    }

    @UseGuards(AuthGuard)
    @Post()
    @UseInterceptors(FilesInterceptor('images'))
    async createNewBlog(
        @Body() data: BlogDto,
        @UploadedFiles() images?: Array<Express.Multer.File>
    ) {
        if (images[0]) {
            const imagesUpload = await this.cloudinatyService.uploadBlogFiles(images)
            return this.blogService.createNewBlog(data, imagesUpload)
        } else {
            return this.blogService.createNewBlog(data)
        }
    }
}
