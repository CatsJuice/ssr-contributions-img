import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { svgCode2image } from './utils/svg2image';
import { generateHtml } from './utils/generate-html';
import { OutputFormat } from './dto/base/output-format.dto';
import { themesProcessor } from './charts/themes.processor';
import { GithubUser } from './types/contribution.interface';
import { themes } from './utils/get-theme';
import { ConfigSvgQueryDto } from './dto/config-svg.query.dto';
import { SvgResponseResolverOptions } from './types/svg-res-resolver-opt.interface';
import { renderContributionSvg } from '../shared/render-core/render';

@Injectable()
export class AppService {
  constructor(@Inject(ConfigService) private readonly _cfgSrv: ConfigService) {}
  /**
   * Create theme graph svg code
   * @returns
   */
  public async generateThemeSvgCode(dark) {
    return themesProcessor(themes, dark);
  }

  /**
   * Create chart svg code
   * @param username
   * @param config
   * @returns
   */
  public async generateChartSvgCode(
    user: GithubUser,
    _config: ConfigSvgQueryDto,
  ) {
    const config = { ..._config };
    if ([OutputFormat.PNG, OutputFormat.JPEG].includes(_config.format)) {
      delete config.animation;
    }

    const svgStr = await renderContributionSvg(user, config);
    if (!svgStr) {
      throw new BadRequestException(
        'Unimplemented chart type: ' + config.chart,
      );
    }

    return svgStr;
  }

  /**
   * Make a response to client with different format
   * @param res
   * @param svgCode
   * @param format
   * @param quality
   * @param filename
   */
  public async resolveResponseByFormat(
    res: Response,
    svgCode: string,
    options: SvgResponseResolverOptions = {},
  ) {
    const { format, quality, dark } = options;
    const filename = options.filename || `${Date.now()}`;

    const roundQuality = Math.min(
      10,
      Math.max(0.1, parseFloat(`${quality}`) || 1),
    );
    const bg = this._cfgSrv.get(`theme.bg.${dark ? 'dark' : 'light'}`);
    if (format === OutputFormat.SVG) {
      res.header('Content-Type', 'image/svg+xml; charset=utf-8');
      // res.header('Content-Disposition', `inline; filename=${filename}.svg`);
      res.send(Buffer.from(svgCode));
    } else if (format === OutputFormat.XML) {
      res.header('Content-Type', 'application/xml;charset=utf-8');
      res.send(svgCode);
    } else if (format === OutputFormat.HTML) {
      res.header('Content-Type', 'text/html;charset=utf-8');
      res.send(generateHtml(svgCode, filename, bg));
    } else if (format === OutputFormat.PNG) {
      res.header('Content-Type', 'image/png;charset=utf-8');
      res.header('Content-Disposition', `inline; filename=${filename}.png`);
      res.send(await svgCode2image(svgCode, 'png', roundQuality, bg));
    } else if (format === OutputFormat.JPEG) {
      res.header('Content-Type', 'image/jpeg;charset=utf-8');
      res.header('Content-Disposition', `inline; filename=${filename}.jpg`);
      res.send(await svgCode2image(svgCode, 'jpeg', roundQuality, bg));
    } else
      this.resolveResponseByFormat(res, svgCode, {
        ...options,
        format: OutputFormat.HTML,
      });
  }
}
