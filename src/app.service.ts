import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as echarts from 'echarts';
import { JSDOM } from 'jsdom';

@Injectable()
export class AppService {
  constructor(
    private readonly _httpSrv: HttpService,
    private readonly _cfgSrv: ConfigService,
  ) {}

  public async generateWall(username: string) {
    // const data = await this._getUserContribution(username);
    const data = await this._render(null);
    return data;
  }

  /**
   * RenderChart
   */
  private async _render(data: any) {
    const { createCanvas } = await require('canvas');
    // echarts.setPlatformAPI({
    //   createCanvas: () => {
    //     return new Canvas(100, 100);
    //   },
    // });
    echarts.setPlatformAPI({
      createCanvas: () => createCanvas(500, 500),
    });

    const { window } = new JSDOM();
    global.window = window;
    global.navigator = window.navigaror;
    global.document = window.document;

    const root = document.createElement('div');
    root.style.cssText = 'width: 500px; height: 500px;';
    Object.defineProperty(root, 'clientWidth', { value: 500 });
    Object.defineProperty(root, 'clientHeight', { value: 500 });

    const chart = echarts.init(root, null, {
      renderer: 'canvas',
    });

    chart.setOption({
      title: {
        text: 'ECharts 入门示例',
      },
      tooltip: {},
      legend: {
        data: ['销量'],
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
      },
      yAxis: {},
      series: [
        {
          animation: false,
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    });

    const base64 = chart.getDataURL({
      type: 'jpg',
      pixelRatio: 2,
      backgroundColor: '#fff',
    });
    const buff = Buffer.from(base64, 'base64');
    chart.dispose();
    return buff;
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
