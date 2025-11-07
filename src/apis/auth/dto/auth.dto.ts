import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  IsStrongPassword, 
  MaxLength, 
  MinLength
} from "class-validator";

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MinLength(3)
  @MaxLength(100) // ✅ allows up to 100 chars
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })
  @MaxLength(20) // ✅ allows up to 20 chars
  password: string;
}

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(3)
  @MaxLength(100) // ✅ allows up to 100 chars
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
