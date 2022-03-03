import { registerAs } from '@nestjs/config';

export default registerAs('github', () => ({
  pat: process.env.GITHUB_PAT,
}));
