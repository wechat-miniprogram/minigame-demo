export function getCurrTime(): number {
  return Math.floor(Date.now() / 1000);
}

export function promisify(func: any) {
  return (args = {}) =>
    new Promise((resolve, reject) => {
      func(
        Object.assign(args, {
          success: resolve,
          fail: reject,
        }),
      );
    });
}
