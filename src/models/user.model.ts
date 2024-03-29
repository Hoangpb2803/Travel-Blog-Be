import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    dateOfBirth: Date;

    @Prop()
    avatar: string;

    @Prop({ default: true })
    active: boolean;

    @Prop({ default: true })
    email: string;

    @Prop({ default: true })
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
