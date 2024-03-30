import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoginDto } from 'src/dtos/login.dto';
import { RegisterDto } from 'src/dtos/register.dto';
import { User } from 'src/models/user.model';
import { AuthRepository } from 'src/repositories/auth.repository';
import * as jwt from 'jsonwebtoken';
import { I_Response } from 'src/interfaces/response-data.interface';
import { SavedBlogRepository } from 'src/repositories/saved-blog.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepo: AuthRepository,
        private readonly savedBlogRepo: SavedBlogRepository
    ) { }

    async login(data: LoginDto) {
        const user = await this.authRepo.login(data)
        if (!user) {
            throw new HttpException("Tài khoản không hợp lệ!", HttpStatus.CONFLICT)
        }
        const { _id, firstName, lastName, avatar } = user
        const userInfo = { _id, firstName, lastName, avatar }

        const access_token = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '10m' })
        const refresh_token = jwt.sign(userInfo, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '1y' })
        return {
            statusCode: HttpStatus.OK,
            access_token,
            refresh_token,
            user: userInfo
        }
    }

    private async createSavedBlog(userId: string) {
        try {
            await this.savedBlogRepo.create({ user: userId })
        } catch (error) {
            console.log(">>> auth-service: getting err when create new saved blog");
            console.log(error);
            throw new InternalServerErrorException
        }
    }

    async register(data: RegisterDto, avatar?: string): Promise<I_Response<User>> {
        try {
            const newUser = await this.authRepo.register(data, avatar)
            if (newUser && newUser._id) {
                await this.createSavedBlog(newUser._id)
                return { statusCode: HttpStatus.OK }
            } else {
                throw new InternalServerErrorException
            }
        } catch (error) {
            console.log(">>> auth-service: getting err when create new user");
            console.log(error);
            throw new ConflictException
        }
    }

    async generateNewToken(refreshToken: string) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY)
            if (decoded) {
                const payload = {
                    _id: (decoded as jwt.JwtPayload)._id,
                    firstName: (decoded as jwt.JwtPayload).firstName,
                    lastName: (decoded as jwt.JwtPayload).lastName,
                    avatar: (decoded as jwt.JwtPayload).avatar,
                }
                const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '10m' })
                const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '1y' })
                return {
                    statusCode: HttpStatus.OK,
                    access_token,
                    refresh_token
                }
            }
        } catch (error) {
            throw new HttpException("token is invalid!", HttpStatus.UNAUTHORIZED)
        }
    }
}
