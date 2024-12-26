import shadcnPreset from '@arishi/ui/tailwind.config';
import { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}', '../../packages/ui/src/components/**/*.{ts,tsx}'],
  presets: [shadcnPreset],
  plugins: [tailwindcssAnimate],
};

export default config;
