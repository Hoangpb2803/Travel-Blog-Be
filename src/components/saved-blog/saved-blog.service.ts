import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { I_Response } from 'src/interfaces/response-data.interface';
import { SavedBlog } from 'src/models/saved-blog.model';
import { SavedBlogRepository } from 'src/repositories/saved-blog.repository';
import { I_SavedBlog } from './interface/save-blog.interface';
import { BlogRepository } from 'src/repositories/blog.repository';

@Injectable()
export class SavedBlogService {
    constructor(
        private readonly savedBlogRepo: SavedBlogRepository,
        private readonly blogRepo: BlogRepository
    ) { }

    async getSavedBlog(userId: string): Promise<I_Response<SavedBlog>> {
        try {
            const savedBlog = await this.savedBlogRepo.getSavedBlog(userId)
            if (savedBlog[0]) {
                return {
                    statusCode: HttpStatus.OK,
                    data: savedBlog[0]
                }
            } throw new ConflictException
        } catch (error) {
            console.log(">>> auth-service: getting err when getting saved blog");
            console.log(error);
            throw new ConflictException
        }
    }

    private async checkIsBlog(data: I_SavedBlog): Promise<boolean> {
        try {
            const { userId, blogId } = data
            const blog = await this.blogRepo.findOneByCondition({ _id: blogId, user: userId })

            if (blog) return true
            return false
        } catch (error) {
            console.log(">>> auth-service: getting err when check blog");
            console.log(error);
            return false
        }
    }

    async addBlogToSaveBlog(_id: string, userId: string, data: I_SavedBlog): Promise<I_Response<SavedBlog>> {
        const isBlog = await this.checkIsBlog(data)
        if (userId === data.userId || !isBlog) {
            throw new HttpException("Bạn không thể lưu blog của chính mình!", HttpStatus.CONFLICT)
        }
        try {
            const savedBlog = await this.savedBlogRepo.addBlogToSavedBlog(_id, data.blogId)
            if (savedBlog) {
                return {
                    statusCode: HttpStatus.OK,
                    data: savedBlog
                }
            } throw new InternalServerErrorException
        } catch (error) {
            console.log(">>> auth-service: getting err when push new blogId to saved blog");
            console.log(error);
            throw new InternalServerErrorException
        }
    }

    async removeBlogToSaveBlog(_id: string, blogId: string): Promise<I_Response<SavedBlog>> {
        try {
            const savedBlog = await this.savedBlogRepo.removeBlogToSavedBlog(_id, blogId)
            if (savedBlog) {
                return {
                    statusCode: HttpStatus.OK,
                    data: savedBlog
                }
            } throw new InternalServerErrorException
        } catch (error) {
            console.log(">>> auth-service: getting err when push new blogId to saved blog");
            console.log(error);
            throw new InternalServerErrorException
        }
    }
}
