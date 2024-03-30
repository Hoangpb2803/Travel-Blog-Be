import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './components/auth/auth.module';
import { CloudinaryModule } from './components/cloudinary/cloudinary.module';
import { BlogModule } from './components/blog/blog.module';
import { UserModule } from './components/user/user.module';
import { SavedBlogModule } from './components/saved-blog/saved-blog.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.DB_CONNECTION_STRING
      })
    }),
    AuthModule,
    CloudinaryModule,
    BlogModule,
    UserModule,
    SavedBlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
