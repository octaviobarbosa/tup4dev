import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UserSingIn } from './app.interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/auth/token')
  getUser(@Body() data: UserSingIn) {
    return this.appService.getUser(data);
  }
}
