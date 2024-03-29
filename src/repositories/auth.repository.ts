import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt'
import { User } from "src/models/user.model";
import { BaseRepository } from "./base.repository";
import { RegisterDto } from "src/dtos/register.dto";
import { LoginDto } from "src/dtos/login.dto";

@Injectable()
export class AuthRepository extends BaseRepository<User> {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>
    ) {
        super(userModel)
    }

    async hashPassword(pw: string): Promise<string> {
        try {
            const saltRounds = 10
            const salt = await bcrypt.genSalt(saltRounds)
            const hash = await bcrypt.hash(pw, salt)
            return hash
        } catch (error) {
            console.error("getting error when hashing password!!!", error)
            throw error;
        }
    }

    async register(data: RegisterDto, avatar?: string): Promise<User> {
        const user = await this.findOneByCondition({ email: data.email });
        if (user) {
            throw new HttpException("This email has already existed!", HttpStatus.CONFLICT)
        }
        const hashPassword = await this.hashPassword(data.password)
        if (hashPassword) {
            return await this.create({ ...data, avatar, password: hashPassword })
        }
    }

    async comparePassword(password: string, hashPassword: string): Promise<boolean> {
        try {
            const checkPassword = await bcrypt.compare(password, hashPassword)
            return checkPassword
        } catch (error) {
            console.error(">>> auth repo: getting error when comparing password!!!", error)
            throw error
        }
    }

    async login(data: LoginDto): Promise<User> {
        const user = await this.findOneByCondition({ email: data.email });
        if (!user) {
            throw new HttpException("This email does not exist!", HttpStatus.CONFLICT)
        }
        const checkPassword = await this.comparePassword(data.password, user.password)
        if (checkPassword) {
            return user
        } return null
    }
}