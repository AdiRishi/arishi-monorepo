import { createSubjects } from '@openauthjs/openauth/subject';
import { email, nonEmpty, object, pipe, string } from 'valibot';

export const subjects = createSubjects({
  user: object({
    userID: string(),
    email: pipe(string(), nonEmpty(), email()),
  }),
});
