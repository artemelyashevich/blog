import {IsEmail, IsOptional, IsString, MaxLength, MinLength} from "class-validator"

export class LoginDTO {
    @IsEmail()
    @IsString()
    @MinLength(4)
    email: string

    @IsString()
    @MinLength(4)
    password: string
}

export class RegisterDTO extends LoginDTO {
    @IsEmail()
    @IsOptional()
    email: string

    @IsString()
    @IsOptional()
    image: string

    @IsString()
    @IsOptional()
    bio: string
}

export class UserUpdateDTO {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string
}

export interface AuthPayload {
    username: string
}