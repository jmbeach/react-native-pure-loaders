export interface InterpolationConfig {
  input: Array<number>,
  output: Array<number>
}
export default class Interpolator {
  static getInterpolator (config: InterpolationConfig) {
    if (config.input.length < 2) {
      throw new Error('input array must have at least 2 entries');
    }

    if (config.output.length < 2) {
      throw new Error('output array must have at least 2 entries');
    }

    if (config.input.length !== config.output.length) {
      throw new Error('input and output array must have same number of items');
    }

    return (x: number) => {
      let i = config.input.indexOf(x);

      // if an exact match exists
      if (i > -1) {
        // return the exact match
        return config.output[i];
      }

      // using clamped values
      if (x < config.input[0]) {
        return config.output[0];
      }

      if (x > config.input[config.input.length - 1]) {
        return config.output[config.output.length - 1];
      }
      
      // find nearest x
      i = 0;
      while (i < config.input.length && config.input[i] < x) {
        i++;
      }

      const x1 = config.input[i - 1];
      const x2 = config.input[i];
      const y1 = config.output[i - 1];
      const y2 = config.output[i];
      return y1 + (y2 - y1) * ((x - x1) / (x2 - x1));
    }
  }
}