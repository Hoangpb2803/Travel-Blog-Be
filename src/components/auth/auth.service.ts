import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from 'src/dtos/login.dto';
import { RegisterDto } from 'src/dtos/register.dto';
import { User } from 'src/models/user.model';
import { AuthRepository } from 'src/repositories/auth.repository';
import * as jwt from 'jsonwebtoken';
import { I_Response } from 'src/interfaces/response-data.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepo: AuthRepository,
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

    async register(data: RegisterDto, avatar?: string): Promise<I_Response<User>> {
        try {
            if (avatar) {
                await this.authRepo.register(data, avatar)
                return { statusCode: HttpStatus.OK }
            } else {
                await this.authRepo.register(data)
                return { statusCode: HttpStatus.OK }
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
