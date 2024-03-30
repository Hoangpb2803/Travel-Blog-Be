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
export class BlogRepository extends BaseRepository<Blog> {
    constructor(
        @InjectModel(Blog.name)
        private readonly blogModel: Model<Blog>
    ) {
        super(blogModel)
    }

    async getBlogsWhenLogin(userId: string, page: number): Promise<Blog[]> {
        return await this.blogModel.aggregate([
            {
                $lookup: {
                    from: "savedblogs",
                    let: { blogId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$user', new mongoose.Types.ObjectId(userId)] },
                                        { $in: ['$$blogId', '$blogs'] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                isSaved: true
                            }
                        }
                    ],
                    as: "savedBlog"
                }
            },
            {
                $addFields: {
                    isSaved: {
                        $cond: {
                            if: { $gt: [{ $size: '$savedBlog' }, 0] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    savedBlog: 0
                }
            },
            {
                $skip: (page - 1) * 5
            },
            {
                $limit: 5
            }
        ]).exec()
    }
}