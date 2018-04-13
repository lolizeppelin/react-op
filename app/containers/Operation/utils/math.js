export function exponential(min, max, power) {
  const transform = (value) => {
    const timeout = Math.round(((Math.exp(power * (value / max)) - 1) / (Math.exp(power) - 1)) * max);
    if (timeout <= min) return min;
    return timeout;
  };

  const reverse = (value) => (1 / power) * Math.log(((Math.exp(power) - 1) * (value / max)) + 1) * max;

  return { transform, reverse };
}


export default exponential;
