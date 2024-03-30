import { Body, Controller, Get, Param, Put, Query, Request, UseGuards } from '@nestjs/common';
import { SavedBlogService } from './saved-blog.service';
import { I_SavedBlog } from './interface/save-blog.interface';
import { AuthGuard } from 'src/guards/verify_token.guard';
import { Request as ExpressRequest, query } from 'express';

@Controller('saved-blog')
export class SavedBlogController {
    constructor(
        private readonly savedBlogService: SavedBlogService
    ) { }

    @UseGuards(AuthGuard)
    @Get()
    getSavedBlog(
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']
        return this.savedBlogService.getSavedBlog(_id)
    }

    @UseGuards(AuthGuard)
    @Put(":id")
    saveBlog(
        @Param("id") _id: string,
        @Body() data: I_SavedBlog,
        @Request() request: ExpressRequest) {
        return this.savedBlogService.addBlogToSaveBlog(_id, request['user']._id, data)
    }

    @UseGuards(AuthGuard)
    @Put(":id")
    removeBlog(
        @Param("id") _id: string,
        @Body() blogId: string) {
        return this.savedBlogService.removeBlogToSaveBlog(_id, blogId)
    }
}
