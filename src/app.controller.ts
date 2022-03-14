import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigSvgQueryDto } from './dto/config-svg.query.dto';
import { GetThemeQueryDto } from './dto/get-theme.query.dto';
import { UsernameExistsGuard } from './guards/username-exists.guard';
import { ExtendedRequest } from './types/extended-request.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(['/_/:username', '/svg/:username'])
  @UseGuards(UsernameExistsGuard)
  async get(
    @Res() res,
    @Request() req: ExtendedRequest,
    @Param('username') username: string,
    @Query(new ValidationPipe({ transform: true })) query: ConfigSvgQueryDto,
  ) {
    console.log('Request svg/:username, username = ', username);
    console.log(JSON.stringify(query));

    const svgCode = await this.appService.generateChartSvgCode(
      req.user, // user was recorded in UsernameExistsGuard
      query,
    );

    this.appService.resolveResponseByFormat(res, svgCode, {
      format: query.format,
      quality: query.quality,
      filename: `${username}_${Date.now()}`,
      dark: query.dark,
    });
  }

  @Get('themes')
  async getThems(@Query() query: GetThemeQueryDto, @Res() res) {
    const raw = await this.appService.generateThemeSvgCode(query.dark);

    this.appService.resolveResponseByFormat(res, raw, {
      format: query.format,
      quality: query.quality,
      filename: `themes_${Date.now()}`,
      dark: query.dark,
    });
  }
}
