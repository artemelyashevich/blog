import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {Repository} from "typeorm";
import {AuthPayload} from "../dto/user.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
            secretOrKey: process.env.SECRET,
        })
    }

    async validate(payload: AuthPayload) {
        const {username} = payload
        const user = this.userRepository.find({
            where: {
                username
            }
        })
        if (!user) {
            throw new UnauthorizedException()
        }
        return user
    }
}