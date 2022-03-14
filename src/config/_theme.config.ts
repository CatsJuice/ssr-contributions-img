import { registerAs } from '@nestjs/config';
export default registerAs('theme', () => ({
  bg: {
    dark: '#22272e',
    light: '#ffffff',
  },
}));
