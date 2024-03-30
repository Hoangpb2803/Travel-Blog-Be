import { Module } from '@nestjs/common';
import { SavedBlogController } from './saved-blog.controller';
import { SavedBlogService } from './saved-blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SavedBlog, SavedBlogSchema } from 'src/models/saved-blog.model';
import { SavedBlogRepository } from 'src/repositories/saved-blog.repository';
import { BlogModule } from '../blog/blog.module';
import { BlogRepository } from 'src/repositories/blog.repository';
import { Blog, BlogSchema } from 'src/models/blog.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SavedBlog.name, schema: SavedBlogSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
  ],
  controllers: [SavedBlogController],
  providers: [SavedBlogService, SavedBlogRepository, BlogRepository]
})
export class SavedBlogModule { }
