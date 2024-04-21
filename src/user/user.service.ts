import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {Repository} from "typeorm";
import {UserUpdateDTO} from "../dto/user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
    ) {
    }

    async findByUserName(username: string): Promise<UserEntity> {
        return this.userRepository.findOne({
            where: {
                username
            }
        })
    }

    async updateUser(username: string, data: UserUpdateDTO): Promise<UserEntity> {
        await this.userRepository.update({username}, data)
        return this.findByUserName(username)
    }

    async followUser(currentUser: UserEntity, username: string) {
        const user = await this.userRepository.findOne({
            where: {
                username
            },
            relations: ['followers']
        })
        user.followers.push(currentUser)
        await user.save()
        return user.toProfile(currentUser)
    }

    async unfollowUser(currentUser: UserEntity, username: string) {
        const user = await this.userRepository.findOne({
            where: {
                username
            },
            relations: ['followers']
        })
        user.followers = user.followers.filter(u => u !== currentUser)
        await user.save()
        return user.toProfile(currentUser)
    }

}
