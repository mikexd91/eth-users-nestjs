import {
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Exclude } from 'class-transformer';

export class UserRegistrationDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
}

export class UserRegistrationResponseDTO {
  id: string
  username: string
  address: string
  privateKey?: string
  password?: string;
  balance?: TokensBalanceOf
}

export class TokensBalanceOf {
  chainlink: string
  ethereum: string
}