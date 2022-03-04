import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  ConfigChartQueryDto,
  OutputFormat,
} from './dto/config-chart.query.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/_/:username')
  async get(
    @Res() res,
    @Param('username') username: string,
    @Query() query: ConfigChartQueryDto,
  ) {
    console.log('Request /:username, username = ', username);
    if (!username)
      throw new NotFoundException('Cannot find user with that username');
    const raw = await this.appService.generateWall(username);

    if (query.format === OutputFormat.SVG_FILE) {
      res.header('Content-Type', 'image/svg;charset=utf-8');
      res.header(
        'Content-Disposition',
        `attachment; filename=${username}_${Date.now()}.svg`,
      );
      res.send(Buffer.from(raw));
    } else {
      res.header('Content-Type', 'application/xml;charset=utf-8');
      res.send(raw);
    }
  }
}
