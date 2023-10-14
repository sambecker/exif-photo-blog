export const sleep = async (delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Ready');
    }, delay);
  });
};
