import { configs, defineConfig } from '@arishi/eslint';

export default defineConfig(
  ...configs.base,
  ...configs.react,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        // @ts-ignore - this property exists
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // Disable rules since shadcn ui is a library and we don't want to enforce these rules on the users
  {
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/array-type': 'off',
      'react/no-unknown-property': 'off',
      'security/detect-object-injection': 'off',
      'jsx-a11y/heading-has-content': 'off',
      'jsx-a11y/anchor-has-content': 'off',
    },
  }
);
