import { OutputFormat } from '../dto/base/output-format.dto';

export interface SvgResponseResolverOptions {
  format?: OutputFormat;
  quality?: number;
  filename?: string;
  dark?: boolean;
}
