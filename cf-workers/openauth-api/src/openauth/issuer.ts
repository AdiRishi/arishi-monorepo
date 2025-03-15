import { issuer } from '@openauthjs/openauth';
import { PasswordProvider } from '@openauthjs/openauth/provider/password';
import { PasswordUI } from '@openauthjs/openauth/ui/password';
import { Env } from '../env';
import { createStorage } from './storage';
import { subjects } from './subject';

export const createIssuer = (env: Env) => {
  return issuer({
    storage: createStorage(env),
    subjects,
    providers: {
      password: PasswordProvider(
        PasswordUI({
          sendCode: async (email, code) => {
            await new Promise((resolve) => setTimeout(resolve, 100));
            console.log('sending email code to ', email, code);
          },
        })
      ),
    },
    success: async (ctx, value) => {
      return ctx.subject('user', {
        userID: '123',
        email: value.email,
      });
    },
  });
};
