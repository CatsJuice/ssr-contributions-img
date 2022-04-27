import * as echarts from 'echarts';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';

import { svgCode2image } from './utils/svg2image';
import { getRandomTheme, getTheme, themes } from './utils/get-theme';
import { generateHtml } from './utils/generate-html';
import { WidgetSize } from './dto/base/widget-size.dto';
import { OutputFormat } from './dto/base/output-format.dto';
import { themesProcessor } from './charts/themes.processor';
import { GithubUser } from './types/contribution.interface';
import { filterEmptyKeys } from './utils/filter-empty-keys';
import { calendarProcessor } from './charts/calendar.processor';
import { isometricProcessor } from './charts/isometric.processor';
import { ChartTpl, ConfigSvgQueryDto } from './dto/config-svg.query.dto';

import {
  defaultCalendarChartConfig,
  defaultCalenderChart3dConfig,
} from './types/chart-config.interface';
import { SvgResponseResolverOptions } from './types/svg-res-resolver-opt.interface';

@Injectable()
export class AppService {
  constructor(private readonly _cfgSrv: ConfigService) {}
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
    // set default configurations
    const config = {
      chart: ChartTpl.CALENDAR,
      ...defaultCalendarChartConfig,
      ..._config,
      colors: _config.colors?.length
        ? _config.colors
        : _config.theme === 'random'
        ? getRandomTheme(_config.dark)
        : getTheme(_config.theme, _config.dark),
      weeks:
        _config.weeks ||
        {
          [WidgetSize.LARGE]: 40,
          [WidgetSize.MIDIUM]: 16,
          [WidgetSize.SMALL]: 7,
        }[_config.widget_size] ||
        16,
    };

    const contributionWeeks =
      user.contributionsCollection.contributionCalendar.weeks
        .sort(
          (w1, w2) =>
            new Date(w2.firstDay).getTime() - new Date(w1.firstDay).getTime(),
        )
        .slice(0, config.weeks);
    const max = contributionWeeks.reduce((prev: number, curr) => {
      return Math.max(
        prev,
        curr.contributionDays.reduce(
          (_prev: number, _curr) => Math.max(_prev, _curr.contributionCount),
          0,
        ),
      );
    }, 0);

    // 1. calc chart width & height
    let svgStr = '';
    if (config.chart === ChartTpl.CALENDAR) {
      const calc = (count) => count * 20 + (count - 1) * 4 + 40;
      const width = calc(config.weeks);
      const height =
        _config.widget_size === WidgetSize.LARGE ? calc(18) : calc(7);
      // 2. init instance
      const chart = echarts.init(null, null, {
        renderer: 'svg',
        ssr: true,
        width,
        height,
      });

      // 3. render by chart type
      chart.setOption(calendarProcessor(contributionWeeks, max, config));
      svgStr = chart.renderToSVGString();
    } else if (config.chart === ChartTpl.BAR3D) {
      return isometricProcessor(contributionWeeks, max, {
        ...defaultCalenderChart3dConfig,
        ...filterEmptyKeys(config),
      });
    } else {
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
