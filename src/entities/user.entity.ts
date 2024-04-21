import {AbstractEntity} from "./abstract-entity";
import {BeforeInsert, Column, Entity, JoinTable, ManyToMany} from "typeorm";
import * as bcrypt from 'bcryptjs'
import {Exclude, instanceToPlain} from "class-transformer";
import {IsEmail} from "class-validator";
import {User} from "../auth/user.decorator";

@Entity('users')
export class UserEntity extends AbstractEntity {
    @Column({
        unique: true
    })
    @IsEmail()
    email: string

    @Column({
        unique: true
    })
    username: string

    @Column({
        default: ''
    })
    bio: string

    @Column({
        default: null,
        nullable: true
    })
    image: string | null

    @ManyToMany(
        type => UserEntity,
        user => user.folowing
    )
    @JoinTable()
    followers: UserEntity[]

    @ManyToMany(
        type => UserEntity,
        user => user.followers
    )
    folowing: UserEntity[]

    @Column()
    @Exclude()
    password: string

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10)
    }

    async comparePassword(attempt: string) {
        return await bcrypt.compare(attempt, this.password)
    }

    toJSON() {
        return instanceToPlain(this)
    }

    toProfile(user: UserEntity) {
        const following = this.followers.includes(user)
        const profile: any = this.toJSON()
        delete profile.followers
        return {...profile, following}
    }
}