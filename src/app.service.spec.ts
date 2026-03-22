import { ConfigService } from '@nestjs/config';

import { AppService } from './app.service';
import { OutputFormat } from './dto/base/output-format.dto';
import * as svg2imageModule from './utils/svg2image';
import * as generateHtmlModule from './utils/generate-html';

describe('AppService', () => {
  const createResponse = () =>
    ({
      header: jest.fn().mockReturnThis(),
      send: jest.fn(),
    }) as any;

  const createService = () =>
    new AppService(
      new ConfigService({
        theme: {
          bg: {
            dark: '#22272e',
            light: '#ffffff',
          },
        },
      }),
    );

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should use the custom background color for html and jpeg responses', async () => {
    const service = createService();
    const res = createResponse();
    const imageBuffer = Buffer.from('image');

    const generateHtml = jest
      .spyOn(generateHtmlModule, 'generateHtml')
      .mockReturnValue('<html></html>');
    const svgCode2image = jest
      .spyOn(svg2imageModule, 'svgCode2image')
      .mockResolvedValue(imageBuffer);

    await service.resolveResponseByFormat(res, '<svg />', {
      format: OutputFormat.HTML,
      filename: 'chart',
      dark: false,
      backgroundColor: '#111827',
    });
    await service.resolveResponseByFormat(res, '<svg />', {
      format: OutputFormat.JPEG,
      filename: 'chart',
      dark: false,
      backgroundColor: '#111827',
    });

    expect(generateHtml).toHaveBeenCalledWith('<svg />', 'chart', '#111827');
    expect(svgCode2image).toHaveBeenCalledWith(
      '<svg />',
      'jpeg',
      1,
      '#111827',
    );
  });

  it('should keep png transparent unless a custom background color is provided', async () => {
    const service = createService();
    const imageBuffer = Buffer.from('image');
    const svgCode2image = jest
      .spyOn(svg2imageModule, 'svgCode2image')
      .mockResolvedValue(imageBuffer);

    await service.resolveResponseByFormat(createResponse(), '<svg />', {
      format: OutputFormat.PNG,
      filename: 'chart',
      dark: true,
    });
    await service.resolveResponseByFormat(createResponse(), '<svg />', {
      format: OutputFormat.PNG,
      filename: 'chart',
      dark: true,
      backgroundColor: '#0f172a',
    });

    expect(svgCode2image).toHaveBeenNthCalledWith(
      1,
      '<svg />',
      'png',
      1,
      undefined,
    );
    expect(svgCode2image).toHaveBeenNthCalledWith(
      2,
      '<svg />',
      'png',
      1,
      '#0f172a',
    );
  });
});
