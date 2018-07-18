const PINTREG = /^[0-9]*[1-9][0-9]*$/;
const INTREG = /^\\d+$/;


export function exponential(min, max, power) {
  const transform = (value) => {
    const timeout = Math.round(((Math.exp(power * (value / max)) - 1) / (Math.exp(power) - 1)) * max);
    if (timeout <= min) return min;
    return timeout;
  };

  const reverse = (value) => (1 / power) * Math.log(((Math.exp(power) - 1) * (value / max)) + 1) * max;

  return { transform, reverse };
}

export function isPint(str) {
  return PINTREG.test(str);
}

export function isInt(str) {
  return INTREG.test(str);
}

/*
"^\\d+$"　　//非负整数（正整数 + 0）
"^[0-9]*[1-9][0-9]*$"　　//正整数
"^((-\\d+)|(0+))$"　　//非正整数（负整数 + 0）
"^-[0-9]*[1-9][0-9]*$"　　//负整数
"^-?\\d+$"　　　　//整数
"^\\d+(\\.\\d+)?$"　　//非负浮点数（正浮点数 + 0）
"^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$"　　//正浮点数
"^((-\\d+(\\.\\d+)?)|(0+(\\.0+)?))$"　　//非正浮点数（负浮点数 + 0）
"^(-(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*)))$"　　//负浮点数
"^(-?\\d+)(\\.\\d+)?$"　　//浮点数
 */


export default exponential;
