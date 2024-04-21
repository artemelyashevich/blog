import {ConflictException, Injectable, InternalServerErrorException, UnauthorizedException} from "@nestjs/common";
import {LoginDTO, RegisterDTO} from "../dto/user.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private jwtService: JwtService
    ) {
    }

    public register = async (credentials: RegisterDTO) => {
        try {
            const user = this.userRepository.create(credentials)
            await user.save()
            const payload = {
                username: user.username
            }
            const token = this.jwtService.sign(payload)
            return {
                user: {
                    ...user.toJSON(),
                    token
                }
            }
        } catch (err) {
            if (err.code === '2305') {
                throw new ConflictException('Username has been already taken')
            }
            throw new InternalServerErrorException()
        }
    }

    public login = async (credentials: LoginDTO) => {
        try {
            const {email, password} = credentials
            const user = await this.userRepository.findOne({
                where: {
                    email
                }
            })
            if (user && await user.comparePassword(password)) {
                const payload = {
                    username: user.username
                }
                const token = this.jwtService.sign(payload)
                return {
                    user: {
                        ...user.toJSON(),
                        token
                    }
                }
            }
        } catch (err) {
            throw new InternalServerErrorException()
        }
        throw new UnauthorizedException('Invalid credentials')
    }
}