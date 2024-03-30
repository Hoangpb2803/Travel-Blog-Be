import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { BlogDto } from 'src/dtos/blog.dto';
import { I_Response } from 'src/interfaces/response-data.interface';
import { Blog } from 'src/models/blog.model';
import { BlogRepository } from 'src/repositories/blog.repository';

@Injectable()
export class BlogService {
    constructor(
        private readonly blogRepo: BlogRepository,
    ) { }

    async getAllBlogs(page: number): Promise<I_Response<Blog>> {
        try {
            const skip = (page - 1) * 5
            const limit = 5
            const blogs = await this.blogRepo.findAllByCondition({}, skip, limit, "user", ["_id", "firstName", "lastName", "avatar"])
            if (blogs[0]) {
                return {
                    statusCode: HttpStatus.OK,
                    data: blogs
                }
            } throw new HttpException("Lỗi server", HttpStatus.INTERNAL_SERVER_ERROR)
        } catch (error) {
            console.log(">>> getting err when trying to get blogs ", error);
            throw new HttpException("Lỗi server", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getBlogsWhenLogin(userId: string, page: number): Promise<I_Response<Blog>> {
        try {
            const blogs = await this.blogRepo.getBlogsWhenLogin(userId, page)
            if (blogs[0]) {
                return {
                    statusCode: HttpStatus.OK,
                    data: blogs
                }
            } throw new InternalServerErrorException
        } catch (error) {
            console.log(">>> getting err when trying to get blogs ", error);
            throw new InternalServerErrorException
        }
    }

    async getBlogDetail(_id: string): Promise<I_Response<Blog>> {
        try {
            const blog = await this.blogRepo.findOneWithPopulate({ _id }, 'user', ["_id", "firstName", "lastName", "avatar"])
            if (blog) {
                return {
                    statusCode: HttpStatus.OK,
                    data: blog
                }
            } throw new ConflictException
        } catch (error) {
            console.log(">>> getting err when trying to get blogs ", error);
            throw new ConflictException
        }
    }

    async createNewBlog(data: BlogDto, images: string[] = []): Promise<I_Response<Blog>> {
        try {
            const newBlog = await this.blogRepo.create({ ...data, images })
            if (newBlog) {
                return {
                    statusCode: HttpStatus.OK,
                    data: newBlog
                }
            } throw new HttpException("Lỗi server", HttpStatus.INTERNAL_SERVER_ERROR)
        } catch (error) {
            console.log(">>> getting err when trying to create blog ", error);
            throw new HttpException("Lỗi server", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
