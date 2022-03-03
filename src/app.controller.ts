import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:username')
  async get(@Param('username') username: string, @Res() res: any) {
    console.log(username);
    if (!username)
      throw new NotFoundException('Cannot find user with that username');

    res.header('Content-Type', 'text/xml;charset=utf-8');
    res.header(
      'Content-Disposition',
      `attachment; filename=${username}_${Date.now()}.svg`,
    );

    const buff = await this.appService.generateWall(username);
    return res.end(buff);
  }
}
