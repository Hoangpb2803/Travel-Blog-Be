import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { TestGuard } from 'src/guards/test.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get(':id')
    getUserDetail(@Param('id') _id: string) {
        return this.userService.getUserDetail(_id)
    }
}
