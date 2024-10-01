/**
 * Since ESLint and many plugins are written in JavaScript, we need to provide
 * or change some types to make them work with TypeScript.
 */

declare module 'eslint-plugin-turbo' {
  import type { Linter, Rule } from 'eslint';

  export const configs: {
    recommended: { rules: Linter.RulesRecord };
  };
  export const rules: Record<string, Rule.RuleModule>;
}

declare module 'eslint-plugin-react' {
  import type { Linter, Rule } from 'eslint';

  export const configs: {
    flat: {
      all: { rules: Linter.RulesRecord };
      recommended: { rules: Linter.RulesRecord };
      'jsx-runtime': { rules: Linter.RulesRecord };
    };
  };
  export const rules: Record<string, Rule.RuleModule>;
}
