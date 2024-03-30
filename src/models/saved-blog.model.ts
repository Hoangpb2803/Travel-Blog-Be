import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.model';
import { Blog } from './blog.model';

@Schema({ timestamps: true })
export class SavedBlog extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: User;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }], default: [] })
    blogs: Blog[];
}

export const SavedBlogSchema = SchemaFactory.createForClass(SavedBlog);
