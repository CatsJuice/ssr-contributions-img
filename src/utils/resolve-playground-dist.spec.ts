import * as fs from 'fs';
import { resolve } from 'path';

import { resolvePlaygroundDistPath } from './resolve-playground-dist';

describe('resolvePlaygroundDistPath', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should prefer the workspace playground build output', () => {
    jest.spyOn(process, 'cwd').mockReturnValue('/workspace');
    jest
      .spyOn(fs, 'existsSync')
      .mockImplementation((candidate) => candidate === resolve('/workspace/playground/dist'));

    expect(resolvePlaygroundDistPath('/workspace/dist/src')).toBe(
      resolve('/workspace/playground/dist'),
    );
  });

  it('should fall back to the compiled relative path when needed', () => {
    jest.spyOn(process, 'cwd').mockReturnValue('/workspace');
    jest.spyOn(fs, 'existsSync').mockImplementation(
      (candidate) => candidate === resolve('/workspace/dist/playground/dist'),
    );

    expect(resolvePlaygroundDistPath('/workspace/dist/src')).toBe(
      resolve('/workspace/dist/playground/dist'),
    );
  });
});
