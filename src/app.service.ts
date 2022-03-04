import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as echarts from 'echarts';
import { calendarProcessor } from './charts/calendar.processor';
import { Contribution } from './types/contribution.interface';
import { defaultCalendarChartOptions } from './types/chart-options.interface';

@Injectable()
export class AppService {
  constructor(
    private readonly _httpSrv: HttpService,
    private readonly _cfgSrv: ConfigService,
  ) {}

  public async generateWall(username: string) {
    const res: any = await this._getUserContribution(username);
    const user = res.data.user;
    if (!user) throw new NotFoundException(`Cannot find user of '${username}'`);
    const chart = await this._render(user);
    return chart;
  }

  /**
   * RenderChart
   */
  private async _render(data: Contribution) {
    const size = 'midium';
    const width =
      {
        midium: 400,
      }[size] || 400;
    const height =
      {
        midium: 200,
      }[size] || 200;

    // In SSR mode the first parameter does not need to be passed in as a DOM object
    const chart = echarts.init(null, null, {
      renderer: 'svg', // must use SVG mode
      ssr: true, // enable SSR
      width, // need to specify height and width
      height,
    });

    // setOption as normal
    const opt = calendarProcessor(data, {
      ...defaultCalendarChartOptions,
    });
    console.log(JSON.stringify(opt));
    chart.setOption(opt);

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
              name
              contributionsCollection {
                  contributionCalendar {
                      colors
                      totalContributions
                      weeks {
                          contributionDays {
                              color
                              contributionCount
                              date
                              weekday
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
