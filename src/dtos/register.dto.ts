import { IsDateString, IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator"

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    readonly firstName: string

    @IsNotEmpty()
    @IsString()
    readonly lastName: string

    // @IsOptional()
    // readonly avartar: string

    @IsNotEmpty()
    @IsDateString()
    dateOfBirth: Date

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string

    @IsNotEmpty()
    @IsString()
    @Length(6, 20, { message: 'Password must be between 6 and 20 characters long' })
    readonly password: string
}