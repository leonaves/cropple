const ramp = 2;

export const cropFractionGenerator = (length: number, r: number) => {
  const arr = [];

  for (let i = 0; i < length; i++) {
    let t = i / (length - 1); // Normalize index to range [0, 1]
    let value;

    if (r === 0) {
      value = t; // Linear
    } else if (r < 0) {
      value = Math.pow(t, 1 + Math.abs(r) * 2); // Closer at zero end
    } else {
      value = 1 - Math.pow(1 - t, 1 + r * 2); // Closer at one end
    }

    arr.push(value);
  }

  return arr;
};
