import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserRegistrationDTO, UserRegistrationResponseDTO } from './dto/user-register.dto';
import { UserRetrievalDTO, UserRetrievalResponseDTO } from './dto/user-retrieval.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Post('/register')
    register(@Body() userRequestBody: UserRegistrationDTO ): Promise<UserRegistrationResponseDTO> {
        return this.userService.registerUser(userRequestBody)
    }

    @Get('balance')
    fetchOne(@Query() userRetrive: UserRetrievalDTO, ): Promise<UserRetrievalResponseDTO> {
        return this.userService.fetchUser(userRetrive)
    }

    @Get('all')
    fetchAll(): Promise<UserRetrievalResponseDTO[]> {
        return this.userService.fetchAllUsers()
    }

   
}
