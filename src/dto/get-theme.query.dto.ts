import { Mixin } from 'ts-mixer';
import { OutputFormatDto } from './output-format.dto';
import { QualityDto } from './quality.dto';

export class GetThemeQueryDto extends Mixin(OutputFormatDto, QualityDto) {}
