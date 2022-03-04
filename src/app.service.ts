import * as sharp from 'sharp';
import * as echarts from 'echarts';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { Contribution } from './types/contribution.interface';
import { calendarProcessor } from './charts/calendar.processor';
import { defaultCalendarChartConfig } from './types/chart-config.interface';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ChartTpl,
  ConfigChartQueryDto,
  WidgetSize,
} from './dto/config-chart.query.dto';
import { getTheme } from './utils/get-theme';

@Injectable()
export class AppService {
  constructor(
    private readonly _httpSrv: HttpService,
    private readonly _cfgSrv: ConfigService,
  ) {}

  public async generateWall(username: string, config: ConfigChartQueryDto) {
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
  private async _render(data: Contribution, conf: ConfigChartQueryDto) {
    // set default configurations
    const config = {
      chart: ChartTpl.CALENDAR,
      ...defaultCalendarChartConfig,
      ...conf,
    };
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
    if (config.chart === ChartTpl.CALENDAR) {
      chart.setOption(
        calendarProcessor(data, {
          ...defaultCalendarChartConfig,
          weeks,
          widgetSize: config.widget_size || config.widgetSize,
          colors: config.colors || getTheme(config.theme),
        }),
      );
    } else {
      throw new BadRequestException(
        'Unimplemented chart type: ' + config.chart,
      );
    }

    // Output string
    const svgStr = chart.renderToSVGString();
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
}
