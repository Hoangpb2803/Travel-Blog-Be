import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt'
import { User } from "src/models/user.model";
import { BaseRepository } from "./base.repository";
import { RegisterDto } from "src/dtos/register.dto";
import { LoginDto } from "src/dtos/login.dto";
import { Blog } from "src/models/blog.model";
import { BlogDto } from "src/dtos/blog.dto";

@Injectable()
export class BlogRepository extends BaseRepository<Blog> {
    constructor(
        @InjectModel(Blog.name)
        private readonly blogModel: Model<Blog>
    ) {
        super(blogModel)
    }

}