import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /*
  Disabled default route
  @Get()
   getHello(): string {
     return this.appService.getHello();
   }
  */
}
