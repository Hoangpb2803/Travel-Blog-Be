import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/dtos/register.dto';
import { LoginDto } from 'src/dtos/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { TestGuard } from 'src/guards/test.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    // @UseGuards(TestGuard)
    @Post('login')
    login(@Body() data: LoginDto) {
        return this.authService.login(data)
    }

    // @UseGuards(TestGuard)
    @Post('register')
    @UseInterceptors(FileInterceptor('avatar'))
    async register(
        @Body() data: RegisterDto,
        @UploadedFile() avatar?: Express.Multer.File) {
        if (avatar.size !== 0) {
            const avatarUpload = await this.cloudinaryService.uploadAvatar(avatar)
            return this.authService.register(data, avatarUpload)
        } else {
            return this.authService.register(data)
        }
    }

    @Post('refresh-token')
    updateToken(@Body("refreshToken") refreshToken: string) {
        return this.authService.generateNewToken(refreshToken)
    }
}
