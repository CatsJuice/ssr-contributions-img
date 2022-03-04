import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { generateHtml } from './utils/generate-html';
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

    const solve = async (format?: string) => {
      if (format === OutputFormat.SVG) {
        res.header('Content-Type', 'image/svg;charset=utf-8');
        res.header(
          'Content-Disposition',
          `inline; filename=${username}_${Date.now()}.svg`,
        );
        res.send(Buffer.from(raw));
      } else if (format === OutputFormat.XML) {
        res.header('Content-Type', 'application/xml;charset=utf-8');
        res.send(raw);
      } else if (format === OutputFormat.HTML) {
        res.header('Content-Type', 'text/html;charset=utf-8');
        res.send(generateHtml(raw, username));
      } else if (format === OutputFormat.PNG) {
        res.header('Content-Type', 'image/svg;charset=utf-8');
        res.header(
          'Content-Disposition',
          `inline; filename=${username}_${Date.now()}.png`,
        );
        res.send(await this.appService.transformSvg2Png(raw));
      } else solve(OutputFormat.HTML);
    };
    solve(query.format);
  }
}
