/**
 * The React Native template's default test rendered the whole <App />, which
 * needs the full native module surface mocked and does not finish in CI. These
 * cover the pure logic instead, which is where the real rules live.
 */
import {
  checkBankCard,
  checkIdCard,
  checkPasswordNotAbc,
  checkPasswordNotSimpleNumber,
  checkPasswordStrength,
  checkPasswordValue,
  checkPassswordStand,
  checkPhone,
  checkUrl,
} from '../src/utils/validate';

describe('checkPhone', () => {
  it('accepts a mainland mobile number', () => {
    expect(checkPhone('13800138000')).toBe(true);
    expect(checkPhone('19912345678')).toBe(true);
  });

  it('rejects the wrong length or prefix', () => {
    expect(checkPhone('1380013800')).toBe(false);
    expect(checkPhone('12800138000')).toBe(false);
    expect(checkPhone('')).toBe(false);
  });
});

describe('checkBankCard', () => {
  it('accepts 11 to 21 digits not starting with zero', () => {
    expect(checkBankCard('6222021234567890')).toBe(true);
  });

  it('rejects a leading zero or a short number', () => {
    expect(checkBankCard('0222021234567890')).toBe(false);
    expect(checkBankCard('622202')).toBe(false);
  });
});

describe('checkIdCard', () => {
  it('accepts an 18-digit id, including one ending in X', () => {
    expect(checkIdCard('11010519491231002X')).toBe(true);
    expect(checkIdCard('110105194912310021')).toBe(true);
  });

  it('rejects an impossible month', () => {
    expect(checkIdCard('110105194913310021')).toBe(false);
  });
});

describe('checkUrl', () => {
  it('accepts urls with and without a protocol', () => {
    expect(checkUrl('https://example.com')).toBe(true);
    expect(checkUrl('www.example.com')).toBe(true);
    expect(checkUrl('example.com:8080')).toBe(true);
  });

  it('rejects something that is not a url', () => {
    expect(checkUrl('not a url')).toBe(false);
  });
});

describe('password rules', () => {
  it('flags the known-weak passwords by name', () => {
    expect(checkPasswordNotAbc('abc=123')).toBe(true);
    expect(checkPasswordNotAbc('S0me-Passw0rd')).toBe(false);
  });

  it('rejects a run of identical or consecutive digits', () => {
    expect(checkPasswordNotSimpleNumber('111111')).toBe(false);
    expect(checkPasswordNotSimpleNumber('123456')).toBe(false);
    expect(checkPasswordNotSimpleNumber('194827')).toBe(true);
  });

  describe('checkPassswordStand', () => {
    it('requires 8-14 characters mixing at least two kinds', () => {
      expect(checkPassswordStand('abcd1234')).toBe(true);
      expect(checkPassswordStand('abcd123!')).toBe(true);
    });

    it('rejects a single character class', () => {
      expect(checkPassswordStand('12345678')).toBe(false);
      expect(checkPassswordStand('abcdefgh')).toBe(false);
    });

    it('rejects the wrong length', () => {
      expect(checkPassswordStand('abc1234')).toBe(false);
      expect(checkPassswordStand('abcd1234abcd1234')).toBe(false);
    });

    it('rejects Chinese characters', () => {
      expect(checkPassswordStand('密码abcd1234')).toBe(false);
    });
  });

  describe('checkPasswordValue', () => {
    it('returns success for an acceptable password', () => {
      expect(checkPasswordValue('abcd1234')).toBe('success');
    });

    it('explains why a weak password was rejected', () => {
      expect(checkPasswordValue('abc=123')).toBe('您设置的密码过于简单');
      expect(checkPasswordValue('12345678')).toBe('8-14位数字、字母、符号组合，需两种或以上');
    });
  });

  describe('checkPasswordStrength', () => {
    it('scores 0 for empty, 1 for one class, 2 for two, 3 for all three', () => {
      expect(checkPasswordStrength('')).toBe(0);
      expect(checkPasswordStrength('abcdefgh')).toBe(1);
      expect(checkPasswordStrength('abcd1234')).toBe(2);
      expect(checkPasswordStrength('abcd1234;')).toBe(3);
    });
  });
});
