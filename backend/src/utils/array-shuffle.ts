interface Array<T> {
  shuffle(this: Array<T>): this;
}

if (!Array.prototype.shuffle) {
  // Can't use lambda function, as that doesn't change 'this' to our Array
  Array.prototype.shuffle = function() {
    const arr = Array.from(this);

    const toSort = arr.map(item => {
      const random = Math.random();
      return { item, random };
    });

    const sorted = toSort.sort((a, b) =>
      a.random > b.random ? -1 : a.random === b.random ? 0 : 1
    );
    sorted.map(item => item.item);
    return sorted.map(item => item.item);
  };
}
