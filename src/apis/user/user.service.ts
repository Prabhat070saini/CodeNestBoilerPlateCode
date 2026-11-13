import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { IServiceOutput } from '../../common/constants/app.interface';
import { EFindUser } from '../../common/constants/app.enum';
import { exception } from '../../common/constants/exception';
import { EXCEPTION_MESSAGE, SUCCESS_MESSAGE } from '../../common/constants';
import { success } from '../../common/functions/common.function';
import { User } from './entities/user.entity';
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly userRepository: UserRepository) {}

  async findUserById(userId: string): Promise<IServiceOutput<User>> {
    try {
      const { data: user, exception: findUserExp } =
        await this.userRepository.findUser({
          valueType: EFindUser.USER_ID,
          value: userId,
        });
      if (findUserExp) {
        this.logger.debug(`[findUserById] ${JSON.stringify(findUserExp)}`);
        return { exception: findUserExp };
      }
      if (!user) {
        this.logger.debug(
          `[findUserById] User not found with user_id ${userId}`,
        );
        return {
          exception: exception.NO_DATA_FOUND(EXCEPTION_MESSAGE.USER.NOT_FOUND),
        };
      }
      return success(
        HttpStatus.OK,
        HttpStatus.OK,
        SUCCESS_MESSAGE.USER.USER_FOUND,
        user,
      );
    } catch (error) {
      this.logger.error(
        `[findUserById] Error occurred while finding user by  give ID: `,
        error instanceof Error ? error.stack : undefined,
      );
      return { exception: exception.SOMETHING_WENT_WRONG };
    }
  }
}
