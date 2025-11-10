import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { IFunctionOutput } from 'src/common/constants/app.interface';
import { EFindUser } from 'src/common/constants/app.enum';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserById  (userId: string): Promise<IFunctionOutput<any>> {
    return this.userRepository.findUser({
      valueType: EFindUser.USER_ID,
      value: userId,
    });
  }
}
