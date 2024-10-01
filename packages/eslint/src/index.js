import { base } from './configs/base.js';
import { react } from './configs/react.js';
import { remix } from './configs/remix.js';

export { defineConfig } from './utils.js';

/**
 * Note: You MUST import files using the .js extension in this entire package
 * (not only this file) otherwise ESLint will not be able to resolve the files.
 */
export const configs = {
  base,
  react,
  remix,
};
