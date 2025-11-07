import { Injectable, Logger } from "@nestjs/common";
import { UserRepository } from "../user/repository/user.repository";
import { SignInDto, SignUpDto } from "./dto/auth.dto";
import { EFindUser, ETokenType } from "src/common/constants/app.enum";
import { exception } from "src/common/constants/exception";
import { HashingService } from "src/common/lib/hashing/hashing.service";
import { IUserCreate } from "../user/user.interface";
import { IServiceOutput, TokenPayload } from "src/common/constants/app.interface";
import { TokenService } from "src/common/token/token.service";
import { ISignInResponse } from "./auth.interface";
@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(private readonly userRepository: UserRepository, private readonly hashingService: HashingService,private readonly tokenService:TokenService) { }

    async signUp(signUpDto: SignUpDto): Promise<IServiceOutput<null>> {

        try {
            const { data: existingUser, exception: findUserExp } = await this.userRepository.findUser({ valueType: EFindUser.EMAIL, value: signUpDto.email });

            if (findUserExp) {
                this.logger.debug(`[signUp] ${JSON.stringify(findUserExp)}`)
                return { exception: findUserExp };
            }
            if (existingUser) {
                this.logger.debug(`[signUp] User already exit with email ${signUpDto.email}`)
                return { exception: exception.EMAIL_ALREADY_EXIST };
            }

            const hashedPassword = await this.hashingService.hashPassword(signUpDto.password);
            const newUser: IUserCreate = {
                name: signUpDto.name,
                email: signUpDto.email,
                password: hashedPassword,
            }

            const { exception: createUserExp } = await this.userRepository.createUser(newUser);
            if (createUserExp) {
                this.logger.debug(`[signUp] ${JSON.stringify(createUserExp)}`)
                return { exception: createUserExp }
            }
            return { success: { code: 200, message: 'User created successfully', data: null, httpStatusCode: 200 } };
        } catch (error) {
            this.logger.error(`[signUp] ${JSON.stringify(error)}`);
            return { exception: exception.INTERNAL_SERVER_ERROR };
        }
    }


    async signIn(signInDto:SignInDto):Promise<IServiceOutput<ISignInResponse>>{
        try {
            const { data: existingUser, exception: findUserExp } = await this.userRepository.findUser({ valueType: EFindUser.EMAIL, value: signInDto.email });

            if (findUserExp) {
                this.logger.debug(`[signIn] ${JSON.stringify(findUserExp)}`)
                return { exception: findUserExp };
            }
            if (!existingUser) {
                this.logger.debug(`[signIn] User not found with email ${signInDto.email}`)
                return { exception: exception.USER_NOT_FOUND };
            }
            const isPasswordMatch = await this.hashingService.matchPassword(signInDto.password, existingUser.password);
            if (!isPasswordMatch) {
                this.logger.debug(`[signIn] Invalid password for user ${signInDto.email}`)
                return { exception: exception.INVALID_PASSWORD };
            }
            const accessTokenPayload:TokenPayload={
                ref:existingUser.user_id,
                type: ETokenType.AccessToken,
            }
            const refreshTokenPayload:TokenPayload={
                ref:existingUser.user_id,
                type: ETokenType.RefreshToken,
            }
            const accessToken= this.tokenService.generate(accessTokenPayload);
            const refreshToken= this.tokenService.generate(refreshTokenPayload);
            const resp:ISignInResponse={
                accessToken,
                refreshToken,
                user_id:existingUser.user_id,
            }
            return { success: { code: 200, message: 'User logged in successfully', data:resp, httpStatusCode: 200 } };
        } catch (error) {
            this.logger.error(`[signIn] ${error}`);
            return { exception: exception.SOMETHING_WENT_WRONG };
        }
    }
}