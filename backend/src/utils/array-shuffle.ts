export {};

declare global {
  interface Array<T> {
    shuffle(): this;
  }
}

Array.prototype.shuffle = () => {
  const arr = Array(this);
  const toSort = arr.map(item => {
    const random = Math.random();
    return { item, random };
  });
  const sorted = toSort.sort((a, b) =>
    a.random > b.random ? -1 : a.random === b.random ? 0 : 1
  );
  return sorted.map(item => item.item);
};
