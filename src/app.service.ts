import * as sharp from 'sharp';
import * as echarts from 'echarts';
import { Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { getTheme } from './utils/get-theme';
import { generateHtml } from './utils/generate-html';
import { WidgetSize } from './dto/base/widget-size.dto';
import { OutputFormat } from './dto/base/output-format.dto';
import { themesProcessor } from './charts/themes.processor';
import { Contribution } from './types/contribution.interface';
import { calendarProcessor } from './charts/calendar.processor';
import { ChartTpl, ConfigSvgQueryDto } from './dto/config-svg.query.dto';
import {
  defaultCalendarChartConfig,
  defaultCalenderChart3dConfig,
} from './types/chart-config.interface';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isometricSvg } from './charts/isometric-svg';
import { check } from 'prettier';

@Injectable()
export class AppService {
  constructor(
    private readonly _httpSrv: HttpService,
    private readonly _cfgSrv: ConfigService,
  ) {}

  public async renderTheme2svg() {
    return themesProcessor();
  }

  /**
   * @param res
   * @param svgCode
   * @param format
   * @param quality
   * @param filename
   */
  public async resolveResponseByFormat(
    res: Response,
    svgCode: string,
    format?: OutputFormat,
    quality?: number,
    filename = `${Date.now()}`,
  ) {
    if (format === OutputFormat.SVG) {
      res.header('Content-Type', 'image/svg;charset=utf-8');
      res.header('Content-Disposition', `inline; filename=${filename}.svg`);
      res.send(Buffer.from(svgCode));
    } else if (format === OutputFormat.XML) {
      res.header('Content-Type', 'application/xml;charset=utf-8');
      res.send(svgCode);
    } else if (format === OutputFormat.HTML) {
      res.header('Content-Type', 'text/html;charset=utf-8');
      res.send(generateHtml(svgCode, filename));
    } else if (format === OutputFormat.PNG) {
      res.header('Content-Type', 'image/png;charset=utf-8');
      res.header('Content-Disposition', `inline; filename=${filename}.png`);
      res.send(
        await this.transformSvg2Image(
          svgCode,
          'png',
          Math.min(10, Math.max(0.1, parseFloat(`${quality}`) || 1)),
        ),
      );
    } else if (format === OutputFormat.JPEG) {
      res.header('Content-Type', 'image/jpeg;charset=utf-8');
      res.header('Content-Disposition', `inline; filename=${filename}.jpg`);
      res.send(
        await this.transformSvg2Image(
          svgCode,
          'jpeg',
          Math.min(10, Math.max(0.1, parseFloat(`${quality}`) || 1)),
        ),
      );
    } else
      this.resolveResponseByFormat(
        res,
        svgCode,
        OutputFormat.HTML,
        quality,
        filename,
      );
  }

  public async generateWall(username: string, config: ConfigSvgQueryDto) {
    const res: any = await this._getUserContribution(username);
    const user = res.data.user;
    if (!user) throw new NotFoundException(`Cannot find user of '${username}'`);
    const chart = await this._render(user, config);
    return chart;
  }

  /**
   * svg code => png buffer
   * @param svgRaw
   * @param resize
   * @returns
   */
  public async transformSvg2Image(svgRaw: string, format: string, resize = 1) {
    const buf = Buffer.from(svgRaw);
    return await sharp(buf)
      .metadata()
      .then(({ width }) => {
        let ref = sharp(buf);
        // TODO: add to configuration
        if (format === 'jpeg') ref = ref.flatten({ background: '#fff' });
        return ref
          .toFormat(format)
          .resize(Math.round(width * resize) * 2)
          .toBuffer();
      });
  }

  /**
   * RenderChart
   */
  private async _render(data: Contribution, conf: ConfigSvgQueryDto) {
    // set default configurations
    const config = {
      chart: ChartTpl.CALENDAR,
      ...defaultCalendarChartConfig,
      ...conf,
    };
    const check = (obj) =>
      Object.keys(obj).reduce((res, key) => {
        if (obj[key]) res[key] = obj[key];
        return res;
      }, {});
    const colors = conf.colors?.length ? conf.colors : getTheme(config.theme);

    // 1. calc chart width & height
    const size = config.widget_size;
    let weeks = Math.min(50, Math.max(0, parseInt(`${config.weeks}`) || 0));
    if (!weeks)
      weeks =
        {
          [WidgetSize.LARGE]: 40,
          [WidgetSize.MIDIUM]: 16,
          [WidgetSize.SMALL]: 7,
        }[size] || 16;
    let svgStr = '';
    if (config.chart === ChartTpl.CALENDAR) {
      const calc = (count) => count * 20 + (count - 1) * 4 + 40;
      const width = calc(weeks);
      const height = size === WidgetSize.LARGE ? calc(18) : calc(7);
      // 2. init instance
      const chart = echarts.init(null, null, {
        renderer: 'svg',
        ssr: true,
        width,
        height,
      });

      // 3. render by chart type
      chart.setOption(
        calendarProcessor(data, {
          ...defaultCalendarChartConfig,
          weeks,
          widgetSize: config.widget_size || config.widgetSize,
          colors,
          tz: config.tz,
        }),
      );
      svgStr = chart.renderToSVGString();
    } else if (config.chart === ChartTpl.BAR3D) {
      console.log(config.gap);
      return isometricSvg(data, {
        ...defaultCalenderChart3dConfig,
        ...check({
          weeks,
          widgetSize: config.widget_size || config.widgetSize,
          colors,
          gap: config.gap,
          scale: config.scale,
          light: config.light,
        }),
      });
    } else {
      throw new BadRequestException(
        'Unimplemented chart type: ' + config.chart,
      );
    }
    return svgStr;
  }

  /**
   * Get data by github openAPI
   * @param username
   * @returns
   */
  private async _getUserContribution(username: string) {
    const res = await this._httpSrv.axiosRef({
      method: 'POST',
      baseURL: 'https://api.github.com/graphql',
      headers: {
        Authorization: `Bearer ${this._cfgSrv.get('github.pat')}`,
      },
      data: {
        query: `query {
          user(login: "${username}") {
              contributionsCollection {
                  contributionCalendar {
                      weeks {
                          contributionDays {
                              contributionCount
                              date
                          }
                          firstDay
                      }
                  }
              }
          }
        }`,
      },
    });
    return res.data;
  }

  // /**
  //  * test node-canvas
  //  * @param username
  //  * @returns
  //  */
  // public async drawCanvas(username: string) {
  //   const res = await this._getUserContribution(username);
  //   const user = res.data.user;
  //   if (!user) throw new NotFoundException(`Cannot find user of '${username}'`);

  //   if (!global['window']) global['window'] = {} as any;
  //   const { createCanvas } = await require('canvas');
  //   // console.log(Obelisk);
  //   // const obelisk = Obelisk(Canvas);
  //   const canvas = createCanvas(1000, 1000);

  //   const obelisk = await require('obelisk.js');
  //   // create pixel view container in point
  //   const point = new obelisk.Point(500, 240);

  //   const pixelView = new obelisk.PixelView(canvas, point);

  //   // create cube
  //   const dimension = new obelisk.CubeDimension(120, 200, 60);

  //   const color = new obelisk.CubeColor().getByHorizontalColor(
  //     Number.parseInt('#00ff00'.replace('#', ''), 16),
  //   );

  //   const cube = new obelisk.Cube(dimension, color);

  //   //var cube = new obelisk.Cube(dimension, color, false);
  //   pixelView.renderObject(cube);

  //   const ctx = canvas.getContext('2d');

  //   // Write "Awesome!"
  //   ctx.font = '30px Impact';
  //   ctx.rotate(0.1);
  //   ctx.fillText('Awesome!', 50, 100);

  //   // Draw line under text
  //   const text = ctx.measureText('Awesome!');
  //   ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  //   ctx.beginPath();
  //   ctx.lineTo(50, 102);
  //   ctx.lineTo(50 + text.width, 102);
  //   ctx.stroke();

  //   const stream = canvas.createPNGStream();
  //   console.log(stream);
  //   if (!stream) throw new BadRequestException('Cannot create PNG stream');
  //   return stream;
  // }
}
