import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import * as momentTz from 'moment-timezone';
import { AppService } from './app.service';
import { ConfigSvgQueryDto } from './dto/config-svg.query.dto';
import { GetThemeQueryDto } from './dto/get-theme.query.dto';
import { UsernameExistsGuard } from './guards/username-exists.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(['/_/:username', '/svg/:username'])
  @UseGuards(UsernameExistsGuard)
  async get(
    @Res() res,
    @Param('username') username: string,
    @Query(new ValidationPipe({ transform: true })) query: ConfigSvgQueryDto,
  ) {
    console.log('Request svg/:username, username = ', username);
    console.log(JSON.stringify(query));

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

  // @Get(['/canvas/:username'])
  // @UseGuards(UsernameExistsGuard)
  // async getCanvas(
  //   @Response({ passthrough: true }) res,
  //   @Param('username') username: string,
  //   @Query(new ValidationPipe({ transform: true })) query: ConfigCanvasQueryDto,
  // ): Promise<StreamableFile> {
  //   console.log('Request canvas/:username, username = ', username);
  //   console.log(JSON.stringify(query));
  //   res.header('Content-Type', 'img/png');
  //   res.header('Content-Disposition', `inline; filename="${username}.png"`);
  //   return new StreamableFile(await this.appService.drawCanvas(username));
  // }

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

  @Get('time')
  async testGetTime(@Query('tz') tz: string) {
    const osTime = momentTz.tz(Date.now(), process.env.TZ);
    const tzTime = osTime.clone().tz(tz);
    const format = 'YYYY-MM-DD HH:mm:ss';
    return {
      tz,
      osTime: osTime.format(format),
      tzTime: tzTime.format(format),
    };
  }
}
