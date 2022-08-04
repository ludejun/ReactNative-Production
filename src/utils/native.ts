import { Linking } from 'react-native';

/**
 * 打电话
 * @param phoneNum 
 * @returns 
 */
export const callPhone = (phoneNum: string) => Linking.openURL(`tel:${phoneNum}`);
/**
 * 打开系统浏览器
 * @param url 
 * @returns 
 */
export const linkUrl = (url: string) => Linking.openURL(url);
/**
 * 发送邮件
 * @param mail 
 * @returns 
 */
export const linkMail = (mail: string) => Linking.openURL(`mailto:${mail}`);
/**
 * 发送短信
 * @param phoneNum 
 * @returns 
 */
export const linkSms = (phoneNum: string) => Linking.openURL(`sms:${phoneNum}`);
