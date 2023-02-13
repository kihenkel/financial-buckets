export const chainPromises = async (items: any[], handler: (item: any) => Promise<any>) => {
  const results: any[] = [];
  await items.reduce((currentPromise, item) => {
    return currentPromise
      .then(() => handler(item)
      .then((result) => results.push(result)));
  }, Promise.resolve());
  return results;
};