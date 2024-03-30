import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import { SavedBlog } from "src/models/saved-blog.model";

@Injectable()
export class SavedBlogRepository extends BaseRepository<SavedBlog> {
    constructor(
        @InjectModel(SavedBlog.name)
        private readonly savedBlogModel: Model<SavedBlog>
    ) {
        super(savedBlogModel)
    }

    async getSavedBlog(_id: string): Promise<SavedBlog[]> {
        return await this.savedBlogModel.aggregate([
            {
                $match: { user: new mongoose.Types.ObjectId(_id) }
            },
            {
                $lookup: {
                    from: "blogs",
                    let: { blogIds: "$blogs" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$_id", "$$blogIds"]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "user",
                                foreignField: "_id",
                                as: 'userInfo'
                            }
                        },
                        {
                            $unwind: "$userInfo"
                        },
                        {
                            $addFields: {
                                "userInfo.name": {
                                    $concat: ["$userInfo.lastName", " ", "$userInfo.firstName"]
                                }
                            }
                        },
                        {
                            $replaceRoot: {
                                newRoot: {
                                    $mergeObjects: ["$$ROOT", { "author": "$userInfo.name" }]
                                }
                            }
                        },
                        {
                            $project: {
                                "userInfo": 0
                            }
                        }
                    ],
                    as: "blogs"
                }
            },
            {
                $project: {
                    user: 1,
                    blogs: 1
                }
            }
        ]).exec()
    }

    async addBlogToSavedBlog(_id: string, blogId: string): Promise<SavedBlog> {
        return this.savedBlogModel.findByIdAndUpdate(
            _id,
            { $push: { blogs: blogId } },
            { new: true }
        );
    }

    async removeBlogToSavedBlog(_id: string, blogId: string): Promise<SavedBlog> {
        return this.savedBlogModel.findByIdAndUpdate(
            _id,
            { $pull: { blogs: blogId } },
            { new: true }
        );
    }
}