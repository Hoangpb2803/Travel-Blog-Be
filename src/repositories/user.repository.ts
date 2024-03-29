import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import * as bcrypt from 'bcrypt'
import { User } from "src/models/user.model";
import { BaseRepository } from "./base.repository";
import { RegisterDto } from "src/dtos/register.dto";
import { LoginDto } from "src/dtos/login.dto";
import { Blog } from "src/models/blog.model";
import { BlogDto } from "src/dtos/blog.dto";

@Injectable()
export class UserRepository extends BaseRepository<User> {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>
    ) {
        super(userModel)
    }

    async getUserDetail(_id: string): Promise<User[]> {
        return await this.userModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(_id) } }, // Chuyển '_id' thành ObjectId
            {
                $lookup: {
                    from: 'blogs',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'blogs'
                }
            },
            {
                $unwind: {
                    path: "$blogs",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "blogs.user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $addFields: {
                    "blogs.user._id": "$user._id",
                    "blogs.user.firstName": "$user.firstName",
                    "blogs.user.lastName": "$user.lastName",
                    "blogs.user.avatar": "$user.avatar"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    firstName: { $first: "$firstName" },
                    lastName: { $first: "$lastName" },
                    dateOfBirth: { $first: "$dateOfBirth" },
                    avatar: { $first: "$avatar" },
                    email: { $first: "$email" },
                    createdAt: { $first: "$createdAt" },
                    blogs: { $push: "$blogs" }
                }
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    dateOfBirth: 1,
                    avatar: 1,
                    email: 1,
                    createdAt: 1,
                    blogs: 1
                }
            }
        ]).exec()
    }
}