import { Body, Controller, Get, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { BlogDto } from 'src/dtos/blog.dto';
import { BlogService } from './blog.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthGuard } from 'src/guards/verify_token.guard';

@Controller('blog')
export class BlogController {
    constructor(
        private readonly blogService: BlogService,
        private readonly cloudinatyService: CloudinaryService
    ) { }

    @Get()
    getAllBlog(@Query() page: number) {
        return this.blogService.getAllBlogs(page)
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
