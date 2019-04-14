export {};

declare global {
  interface Number {
    forEach(callback: (i: Number) => void): void;
  }
}

Number.prototype.forEach = function(callback: (i: Number) => void): void {
  if (this == null) {
    throw new TypeError('this is null or not defined');
  }

  const N = Number(this);

  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }

  let i = 0;

  while (i < N) {
    callback.call(undefined, i++);
  }
};
