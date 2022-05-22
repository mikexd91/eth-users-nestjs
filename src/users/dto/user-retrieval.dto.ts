import {
  IsString,
} from 'class-validator';

export class UserRetrievalDTO {
  @IsString()
  id: string;
}

export class UserRetrievalResponseDTO {
  id: string
  username: string
  address: string
}