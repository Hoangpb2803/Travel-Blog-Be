import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { I_Response } from 'src/interfaces/response-data.interface';
import { User } from 'src/models/user.model';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepo: UserRepository) { }

    async getUserDetail(_id: string): Promise<I_Response<User>> {
        try {
            const user = await this.userRepo.getUserDetail(_id)
            if (user[0]) {
                return {
                    statusCode: HttpStatus.OK,
                    data: user[0]
                }
            } throw new InternalServerErrorException
        } catch (error) {
            console.log(">>> getting err when trying to get user info: ", error);
            throw new InternalServerErrorException
        }
    }
}
