import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    UseGuards,
    ValidationPipe
} from '@nestjs/common';
import {UserService} from "./user.service";
import {User} from "../auth/user.decorator";
import {AuthGuard} from "@nestjs/passport";
import {UserEntity} from "../entities/user.entity";
import {UserUpdateDTO} from "../dto/user.dto";

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) {
    }

    @Get()
    @UseGuards(AuthGuard())
    async indCurrentUser(@User() user: UserEntity) {
        const profile = await this.userService.findByUserName(user.username)
        if (!profile) {
            throw new NotFoundException()
        }
        return profile
    }

    @Get('/:username')
    async findUserByUsername(@Param('username') username: string): Promise<UserEntity> {
        const user = await this.userService.findByUserName(username)
        if (!user) {
            throw new NotFoundException()
        }
        return user
    }

    @Put()
    @UseGuards(AuthGuard())
    update(@User() user: UserEntity, @Body(ValidationPipe) data: UserUpdateDTO) {
        return this.userService.updateUser(user.username, data)
    }

    @Post('/:username/follow')
    @UseGuards(AuthGuard())
    async followUser(@User() user: UserEntity, @Param('username') username: string) {
        const profile = await this.userService.followUser(user, username)
        return {profile}
    }

    @Delete('/:username/follow')
    @UseGuards(AuthGuard())
    async unfollowUser(@User() user: UserEntity, @Param('username') username: string) {
        const profile = await this.userService.unfollowUser(user, username)
        return {profile}
    }
}
