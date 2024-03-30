import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from 'src/repositories/auth.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user.model';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { SavedBlogRepository } from 'src/repositories/saved-blog.repository';
import { SavedBlog, SavedBlogSchema } from 'src/models/saved-blog.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: SavedBlog.name, schema: SavedBlogSchema },
    ]),
    CloudinaryModule
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, SavedBlogRepository]
})
export class AuthModule { }
