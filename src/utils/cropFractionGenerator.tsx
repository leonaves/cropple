export const cropFractionGenerator = (
  length: number,
  ramp: number = 0,
  rate: number = 2,
) => {
  const arr = [];

  for (let i = 0; i < length; i++) {
    let t = i / (length - 1); // Normalize index to range [0, 1]
    let value;

    if (ramp === 0) {
      value = t; // Linear
    } else if (ramp < 0) {
      value = Math.pow(t, 1 + Math.abs(ramp) * rate); // Closer at zero end
    } else {
      value = 1 - Math.pow(1 - t, 1 + ramp * rate); // Closer at one end
    }

    arr.push(value);
  }

  return arr;
};
