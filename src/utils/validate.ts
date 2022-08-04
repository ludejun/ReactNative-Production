export const phoneReg = /^1[3-9][0-9]{9}$/;
export const idCardReg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
export const bankCardReg = /^[1-9]{1}\d{10,20}$/;
export const urlReg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/;

// 不能是abc
export const checkPasswordNotAbc = (value = '') =>
  [
    'abc=123',
    'abc=1234',
    'abcd=1234',
    'a12345678',
    'abc123456',
    'lvc=1234',
    'lvic=123',
    'lvic=1234',
  ].includes(value);

/**
 * @description 不是连续数字或重复数字(交易密码验证)
 */
export const checkPasswordNotSimpleNumber = (value = '') =>
  !(
    /^(\d)\1{5}$/.test(value) ||
    /^(\d)\1{5}$/.test(
      Array.from(String(value))
        .map((num, index) => Number(num) + String(value).length - index - 1)
        .join(''),
    )
  );

/**
 * @description 8-14位的密码
 */
export const checkPassswordStand = (value = '') =>
  /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{8,14}$/.test(value);

// 密码校验 
export const checkPasswordValue = (value: string): string => {
  if (checkPasswordNotAbc(value)) return '您设置的密码过于简单';
  if (!checkPassswordStand(value)) return '8-14位数字、字母、符号组合，需两种或以上';
  return 'success';
};

export const checkPasswordStrength = (value: string) => {
  // eslint-disable-next-line no-useless-escape
  const specialReg = /[。~\+\\\/\?\|:\.<>{}()';="]/;
  const numberReg = /[0-9]+/;
  const letterReg = /[a-zA-Z]+/;
  const hasSpecial = specialReg.test(value);
  const hasNumber = numberReg.test(value);
  const hasLetter = letterReg.test(value);
  if (!value) return 0;
  if (hasLetter && hasNumber && hasSpecial) return 3; /* 强 */
  if ((hasLetter && hasNumber) || (hasNumber && hasSpecial) || (hasLetter && hasSpecial))
    return 2; /* 中 */
  return 1; /* 弱 */
};

export const checkPhone = (value = '') => phoneReg.test(value);
export const checkIdCard = (value = '') => idCardReg.test(value);
export const checkBankCard = (value: string): boolean => bankCardReg.test(value);
export const checkUrl = (value: string): boolean => urlReg.test(value);
