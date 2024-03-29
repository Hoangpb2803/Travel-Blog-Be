import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.model';

@Schema({ timestamps: true })
export class Blog extends Document {
    @Prop({ required: true })
    address: string;

    @Prop()
    country: string;

    @Prop()
    city: string;

    @Prop()
    content: string;

    @Prop({ default: [] })
    images: string[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: User;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
