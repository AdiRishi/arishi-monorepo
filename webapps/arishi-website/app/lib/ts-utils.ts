export function wrapPromise<T>(promise: Promise<T>): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
  return new Promise<T>(async (resolve, reject) => {
    try {
      const result = await promise;
      resolve(result);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
      reject(error);
    }
  });
}
