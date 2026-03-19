import * as fs from 'fs';
import { resolve } from 'path';

export function resolvePlaygroundDistPath(baseDir = __dirname) {
  const candidates = [
    resolve(process.cwd(), 'playground/dist'),
    resolve(baseDir, '../playground/dist'),
    resolve(baseDir, '../../playground/dist'),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) || candidates[0];
}
