import React, { MutableRefObject, useEffect, useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { TextField as UITextField, View, Colors } from 'react-native-ui-lib';
import {
  checkPhone,
  checkIdCard,
  checkPasswordValue,
  checkPasswordStrength as checkPasswordStrengthUtils,
  checkBankCard,
  deviceType,
} from '../../utils';
import { ErrorText } from '../Utils';

const errMsgView = (errMsg: string | null | undefined) => {
  if (errMsg)
    return (
      <View>
        <ErrorText title={errMsg} style={{ paddingTop: -5 }} />
      </View>
    );
  return null;
};
const imageConfig = {
  pasOpen: require('./image/pasOpen.png'),
  pasClose: require('./image/pasClose.png'),
};

const placeholderConfig = {
  phone: '请输入手机号码',
  password: '请输入密码',
  checkPassword: '请输入密码',
  checkPasswordStrength: '请输入密码',
  reCheckPassword: '输入确认密码',
  idCard: '请输入您的身份证号码',
  name: '请输入姓名',
  default: '请输入',
  money: '预约股权产品500万起',
  bankCard: '请输入10-20位储蓄卡卡号',
  setPassword: '请输入密码',
};

const errConfig: Record<
| 'phone'
| 'password'
| 'checkPassword'
| 'checkPasswordStrength'
| 'idCard'
| 'default'
| 'name'
| 'reCheckPassword'
| 'money'
| 'bankCard'
| 'setPassword',
string | null
> = {
  phone: '请输入正确的手机号码',
  password: null,
  checkPassword: null,
  checkPasswordStrength: null,
  idCard: null,
  default: null,
  name: null,
  reCheckPassword: null,
  money: null,
  bankCard: null,
  setPassword: null,
};

export const textFieldUnderlineColor = {
  default: '#ddd',
  error: Colors.errorRed,
  focus: Colors.primaryColor,
  disabled: 'grey',
};

export type TextFieldRefType = { state: { value: string } };

export type TextFieldForwardRefType<T = TextFieldRefType> = MutableRefObject<T>;
interface TextFieldProps {
  type?:
  | 'phone'
  | 'password'
  | 'checkPassword'
  | 'checkPasswordStrength'
  | 'idCard'
  | 'default'
  | 'name'
  | 'reCheckPassword'
  | 'money'
  | 'bankCard'
  | 'setPassword'
  placeholder?: string
  onChangeText?: Function
  forwardRef?: TextFieldForwardRefType //<{current: {state: {value: string}}}>
  value?: string
  checkValueRef?: TextFieldForwardRefType
  onFocus?: () => void
  onBlur?: () => void
  checkRePasswordVisable?: boolean
  required?: boolean
  isPhoneNull?: boolean
  clearButtonMode?: string
  keyboardType?: string
}

export const TextField: React.FC<TextFieldProps> = (props: TextFieldProps) => {
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [pasVisable, setPasVisable] = useState(true);
  const [field, setField] = useState('');

  const {
    type = 'phone',
    placeholder = null,
    onChangeText = () => {},
    forwardRef = { current: { state: { value: '' } } },
    value = '',
    checkValueRef = { current: { state: { value: '' } } },
    onFocus = () => {},
    onBlur = () => {},
    checkRePasswordVisable = true,
    required = true,
    isPhoneNull = false,
    ...restProps
  } = props;

  const onPhoneField = (e: string) => {
    setField(e);
    if (e.length > 10 && checkPhone(e)) {
      setErrMsg(null);
      onChangeText(false, e);
    } else if (e.length > 10 && !checkPhone(e)) {
      setErrMsg(errConfig[type]);
      onChangeText(true, e);
    } else {
      setErrMsg(null);
      onChangeText(true, e);
    }
  };
  const onPhoneBlur = () => {
    if (checkPhone(field) || (field === '' && isPhoneNull)) setErrMsg(null);
    else setErrMsg(errConfig[type]);
  };
  const onPasswordField = (e: string) => {
    if (e.length >= 1) onChangeText(false, e);
    else onChangeText(true, e);
  };
  const onIdCardField = (e: string) => {
    if ((e.length === 15 || e.length === 18) && checkIdCard(e)) {
      onChangeText(false, e);
      setErrMsg(null);
    } else if (((e.length === 15 || e.length === 18) && !checkIdCard(e)) || e.length > 18) {
      onChangeText(true, e);
      setErrMsg('请输入正确的证件号码');
    } else {
      onChangeText(true, e);
      setErrMsg(null);
    }
  };
  const onNameField = (e: string) => {
    if (e.length === 0) {
      if (required) setErrMsg('请正确输入不能为空');
      else setErrMsg(null);
      onChangeText(e);
    } else {
      setErrMsg(null);
      onChangeText(e);
    }
  };
  const onCheckPasswordField = (e: string) => {
    if (checkPasswordValue(e) === 'success') {
      setErrMsg(null);
      onChangeText(false, e);
    } else {
      setErrMsg(checkPasswordValue(e));
      onChangeText(true, e);
    }
  };
  const onReCheckPasswordField = (e: string) => {
    const {
      state: { value: passwordValue },
    } = checkValueRef && checkValueRef.current;
    if (e.length >= 8 && passwordValue === e) {
      setErrMsg(null);
      onChangeText(false, e);
      return false;
    }
    if (e.length >= 8 && passwordValue !== e) {
      setErrMsg('两次输入密码不一致');
      onChangeText(true, e);
      return false;
    }
    setErrMsg(null);
    onChangeText(true, e);
  };
  const onCheckPasswordStrength = (e: string) => {
    const strength = checkPasswordStrengthUtils(e);
    onChangeText(strength, e);
  };
  const onPasswordRightBtn = () => setPasVisable(!pasVisable);
  const onMoneyField = (e: string) => {
    // const reg = /^[1-9]\d*$/;
    // if (reg.test(e) && Number(e) >= 500) {
    //   onChangeText(false, e);
    //   setErrMsg(null);
    // } else if (reg.test(e)) {
    //   onChangeText(true, e);
    //   setErrMsg('金额必须大于等于500万元');
    //   return false;
    // } else setErrMsg('请正确输入金额');
  };
  const onPasswordFocus = () => {
    onFocus();
  };
  const onPasswordBlur = () => {
    onBlur();
  };
  const onBankCardChange = (e: string) => {
    const bankNo = e.replace(/\s/g, '');
    setField(bankNo);
    onChangeText(!checkBankCard(bankNo), bankNo);
    if (bankNo.length > 9)
      if (checkBankCard(bankNo)) setErrMsg(null);
      else setErrMsg('请正确输入储蓄卡卡号');
    else setErrMsg(null);
  };
  const onBankCardBlur = () => {
    if (checkBankCard(field)) setErrMsg(null);
    else setErrMsg('请正确输入储蓄卡卡号');
  };
  useEffect(() => {
    if (type === 'reCheckPassword') {
      const {
        state: { value = '' },
      } = forwardRef && forwardRef.current;
      if (value && !checkRePasswordVisable) setErrMsg(null);
      if (value && checkRePasswordVisable) setErrMsg('两次输入密码不一致');
    }
  }, [checkRePasswordVisable]);
  return (
    <>
      {type === 'phone' ? (
        <UITextField
          ref={forwardRef}
          value={value}
          title={null}
          placeholder={placeholder || placeholderConfig[type]}
          error={errMsgView(errMsg)}
          onChangeText={onPhoneField}
          underlineColor={textFieldUnderlineColor}
          keyboardType={'numeric'}
          onBlur={onPhoneBlur}
          style={TextFieldStyle.inputStyle}
          placeholderTextColor={Colors.grey99}
          clearButtonMode={'always'}
        />
      ) : null}
      {type === 'password' ? (
        <UITextField
          textContentType={'password'}
          keyboardType={'default'}
          ref={forwardRef}
          title={null}
          placeholder={placeholder || placeholderConfig[type]}
          onChangeText={onPasswordField}
          underlineColor={textFieldUnderlineColor}
          rightButtonProps={{
            iconSource: pasVisable ? imageConfig.pasClose : imageConfig.pasOpen,
            onPress: onPasswordRightBtn,
            // iconColor: Colors.primaryColor,
            iconColor: 'rgba(0,0,0,0)',
          }}
          rightIconSource={pasVisable ? imageConfig.pasClose : imageConfig.pasOpen}
          secureTextEntry={pasVisable}
          style={TextFieldStyle.inputStyle}
          placeholderTextColor={Colors.grey99}
        />
      ) : null}
      {type === 'checkPassword' ? (
        <UITextField
          ref={forwardRef}
          title={null}
          keyboardType={'default'}
          placeholder={placeholder || placeholderConfig[type]}
          error={errMsgView(errMsg)}
          onChangeText={onCheckPasswordField}
          underlineColor={textFieldUnderlineColor}
          onFocus={onPasswordFocus}
          onBlur={onPasswordBlur}
          rightButtonProps={{
            iconSource: !pasVisable ? imageConfig.pasClose : imageConfig.pasOpen,
            onPress: onPasswordRightBtn,
            // iconColor: Colors.primaryColor,
            iconColor: 'rgba(0,0,0,0)',
          }}
          rightIconSource={!pasVisable ? imageConfig.pasClose : imageConfig.pasOpen}
          secureTextEntry={pasVisable}
          style={TextFieldStyle.inputStyle}
          placeholderTextColor={Colors.grey99}
        />
      ) : null}
      {type === 'reCheckPassword' ? (
        <UITextField
          ref={forwardRef}
          keyboardType={'default'}
          title={null}
          placeholder={placeholder || placeholderConfig[type]}
          error={errMsgView(errMsg)}
          onChangeText={onReCheckPasswordField}
          underlineColor={textFieldUnderlineColor}
          onFocus={onPasswordFocus}
          onBlur={onPasswordBlur}
          rightButtonProps={{
            iconSource: !pasVisable ? imageConfig.pasClose : imageConfig.pasOpen,
            onPress: onPasswordRightBtn,
            // iconColor: Colors.primaryColor,
            iconColor: 'rgba(0,0,0,0)',
          }}
          rightIconSource={!pasVisable ? imageConfig.pasClose : imageConfig.pasOpen}
          secureTextEntry={pasVisable}
          style={TextFieldStyle.inputStyle}
          placeholderTextColor={Colors.grey99}
        />
      ) : null}
      {type === 'checkPasswordStrength' ? (
        <UITextField
          ref={forwardRef}
          title={null}
          keyboardType={'default'}
          placeholder={placeholder || placeholderConfig[type]}
          error={errMsgView(errMsg)}
          onChangeText={onCheckPasswordStrength}
          rightButtonProps={{
            iconSource: !pasVisable ? imageConfig.pasClose : imageConfig.pasOpen,
            onPress: onPasswordRightBtn,
            // iconColor: Colors.primaryColor,
            iconColor: 'rgba(0,0,0,0)',
          }}
          rightIconSource={!pasVisable ? imageConfig.pasClose : imageConfig.pasOpen}
          underlineColor={textFieldUnderlineColor}
          secureTextEntry={pasVisable}
          style={TextFieldStyle.inputStyle}
          placeholderTextColor={Colors.grey99}
        />
      ) : null}
      {type === 'idCard' ? (
        <UITextField
          ref={forwardRef}
          value={value}
          title={null}
          placeholder={placeholder || placeholderConfig[type]}
          error={errMsgView(errMsg)}
          onChangeText={onIdCardField}
          underlineColor={textFieldUnderlineColor}
          style={TextFieldStyle.inputStyle}
          placeholderTextColor={Colors.grey99}
        />
      ) : null}
      {type === 'name' ? (
        <UITextField
          ref={forwardRef}
          value={value}
          title={null}
          placeholder={placeholder || placeholderConfig[type]}
          error={errMsgView(errMsg)}
          onChangeText={onNameField}
          underlineColor={textFieldUnderlineColor}
          style={TextFieldStyle.inputStyle}
          placeholderTextColor={Colors.grey99}
        />
      ) : null}
      {type === 'default' ? (
        <UITextField
          ref={forwardRef}
          value={value}
          title={null}
          placeholder={placeholder || placeholderConfig[type]}
          error={errMsgView(errMsg)}
          onChangeText={onNameField}
          underlineColor={textFieldUnderlineColor}
          onBlur={onBlur}
          style={TextFieldStyle.inputStyle}
          placeholderTextColor={Colors.grey99}
          {...restProps}
        />
      ) : null}
      {type === 'setPassword' ? (
        <UITextField
          ref={forwardRef}
          title={null}
          placeholder={placeholder || placeholderConfig[type]}
          underlineColor={textFieldUnderlineColor}
          onChangeText={onNameField}
          rightButtonProps={{
            iconSource: !pasVisable ? imageConfig.pasClose : imageConfig.pasOpen,
            onPress: onPasswordRightBtn,
            iconColor: 'rgba(0,0,0,0)',
          }}
          rightIconSource={!pasVisable ? imageConfig.pasClose : imageConfig.pasOpen}
          secureTextEntry={pasVisable}
          keyboardType={'numeric'}
          style={TextFieldStyle.inputStyle}
          placeholderTextColor={Colors.grey99}
        />
      ) : null}
      {type === 'money' ? (
        <UITextField
          title={null}
          ref={forwardRef}
          placeholder={placeholder || placeholderConfig[type]}
          error={errMsgView(errMsg)}
          onChangeText={onMoneyField}
          underlineColor={textFieldUnderlineColor}
          keyboardType={'numeric'}
          style={TextFieldStyle.inputStyle}
          placeholderTextColor={Colors.grey99}
        />
      ) : null}
      {type === 'bankCard' ? (
        <UITextField
          title={null}
          value={field}
          ref={forwardRef}
          placeholder={placeholder || placeholderConfig[type]}
          error={errMsgView(errMsg)}
          onChangeText={onBankCardChange}
          onBlur={onBankCardBlur}
          underlineColor={textFieldUnderlineColor}
          keyboardType={'numeric'}
          style={TextFieldStyle.inputStyle}
          placeholderTextColor={Colors.grey99}
        />
      ) : null}
    </>
  );
};

const getFontSize = () => {
  const { height } = Dimensions.get('window');
  if (!deviceType) return 14;
  // pro max, 11 pro max, xr, 11
  if (height === 896) return 14;
  // 12 pro max
  if (height === 926) return 14;
  // 12
  if (height === 844) return 14;
  return 16;
};

const TextFieldStyle = StyleSheet.create({
  inputStyle: {
    color: '#333',
    fontFamily: 'PingFangSC-Regular',
    fontSize: getFontSize(),
  },
});
