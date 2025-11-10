import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ESendOtpPurpose } from 'src/common/constants/app.enum';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100) 
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @MaxLength(20) 
  password: string;
}

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100) 
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SendOtpDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)  
  email: string;

  @IsNotEmpty()
  @IsEnum(ESendOtpPurpose)
  purpose: ESendOtpPurpose;
}

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @IsNotEmpty()
  @IsEnum(ESendOtpPurpose) 
  purpose: ESendOtpPurpose;

  @IsNotEmpty()
  @IsString()
  otp: string;
}
