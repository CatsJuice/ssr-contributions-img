import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigChartQueryDto } from './dto/config-chart.query.dto';
import { GetThemeQueryDto } from './dto/get-theme.query.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/_/:username')
  async get(
    @Res() res,
    @Param('username') username: string,
    @Query(new ValidationPipe({ transform: true })) query: ConfigChartQueryDto,
  ) {
    console.log('Request /:username, username = ', username);
    console.log(JSON.stringify(query));
    if (!username)
      throw new NotFoundException('Cannot find user with that username');

    const raw = await this.appService.generateWall(username, query);
    const filename = `${username}_${Date.now()}`;

    this.appService.resolveResponseByFormat(
      res,
      raw,
      query.format,
      query.quality,
      filename,
    );
  }

  @Get('themes')
  async getThems(@Query() query: GetThemeQueryDto, @Res() res) {
    const raw = await this.appService.renderTheme2svg();
    const filename = `themes_${Date.now()}`;
    this.appService.resolveResponseByFormat(
      res,
      raw,
      query.format,
      query.quality,
      filename,
    );
  }
}
