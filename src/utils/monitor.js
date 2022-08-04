/* eslint-disable */
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { RNStackRef } from 'rn-vconsole-panel';
import { setItem, getItem } from './asyncStorage';
import configs from '../configs';
import { getCustNo } from './getStoreInfo';
import request from './request';

class Monitor {
  constructor() {
    this.version = '1.0.0'; // SDK版本号
  }

  // 初始化
  init({ appName, appVersion, headerName, apiUrl, maxStorage, custno, maccode }) {
    this.storageName = headerName || '__ReactMonitorLogs'; // 持久存储Key、日志发送的Header Key
    this.maxStorage = maxStorage || 5; // 日志最大存储量
    this.ev = []; // 存储事件日志
    this.apiServer = apiUrl || ''; // 日志发送地址，Get请求，一般为请求1*1gif
    this.custno = custno || '';
    this.appName = appName || '';
    this.appVersion = appVersion || '';
    this.maccode = maccode || '';
    if (!this.apiServer)
      console.error('[Monitor报错]：埋点方法需要上报服务端URL，一般为请求1*1gif');

    try {
      // 如果缓存中有数据，初始化到this.ev
      getItem(this.storageName).then((storage) => {
        if (storage !== '[]' && storage !== null) this.ev = storage;
      });

      // // 设置maccode时看缓存中有maccode
      // if (maccode) this.maccode = maccode
      // else getItem('maccode').then(maccodeS => {
      //   if (maccodeS) this.maccode = maccodeS
      //   else {
      //     this.maccode = `${String(Date.now())}-${Math.floor(
      //       1e7 * Math.random(),
      //     )}-${Math.random().toString(16).replace('.', '')}`
      //     setItem('maccode', this.maccode)
      //   }
      // })

      // // 监听浏览器关闭和刷新
      // const self = this;
      // window.onbeforeunload = function () {
      //   self.processLogSerial('AE', ''); // 自动加AE点， TODO：无ID
      //   self.sendLog();
      // };
    } catch (e) {
      console.log('[Monitor初始化报错]:', e);
    }
  }

  // 发送日志
  async sendLog() {
    try {
      if (this.ev.length > 0) {
        this.generateNormal(); // 生成外层通用字段
        console.log(this.baseInfo, this.ev);
        // 当this.baseInfo中无IP信息
        // if (!this.baseInfo.ip) {
        //   this.baseInfo.ip = await getIP();
        // }
        // if (MONITOR_LOG) {
        //   console.group('%c------发送埋点信息------', 'color: #fcff00;font-Size: 18px;')
        //   console.log(this.ev)
        //   console.groupEnd()
        // }
        request(this.apiServer, {
          method: 'POST',
          body: JSON.stringify({ loyalvalleylog: { ...this.baseInfo, ev: this.ev } }),
        })
          .then((data) => {
            console.log(data);
            // if (MONITOR_LOG) {
            //   console.group('%c------埋点信息发送成功------', 'color: #00ff95;font-Size: 18px;')
            //   console.log(this.ev)
            //   console.log(data)
            //   console.groupEnd()
            // }
            // 成功送达则清除数据
            this.ev = [];
            setItem(this.storageName, []);
          })
          .catch(() => {
            // if (MONITOR_LOG) {
            //   console.group('%c------埋点信息发送失败------', 'color: #fe5b5a;;font-Size: 18px;')
            //   console.log(this.ev)
            //   console.groupEnd()
            // }
            // TODO 是否做超时重发
            // console.error('[Monitor报错]：埋点上报不成功');
          });
      }
    } catch (e) {
      console.log('[Monitor报错]', e);
    }
  }

  // 整合日志
  processLogSerial(type, id, custom) {
    // 参考App中stateChange注释，// stateChange和页面的DisMount的关系是：页面先DidMount才会触发NavigationContainer的stateChange
    const stackGap = type === 'PV' ? 1 : 2;
    if (this.ev && Array.isArray(this.ev)) {
      this.ev.push({
        type,
        ts: new Date().getTime(),
        id,
        custom, // TODO，没有不上报
        re:
          RNStackRef.current && RNStackRef.current.length > 1
            ? RNStackRef.current[RNStackRef.current.length - stackGap]
            : '', // URL来源
      });
      setItem(this.storageName, this.ev);
      if (this.ev.length >= this.maxStorage) this.sendLog();
    } else console.error('[Monitor报错]：埋点方法需要先初始化，this.ev未定义');
  }

  // 子日志生成装饰器
  track({ id = '', type = 'PV', custom }) {
    const self = this;
    if (type && id)
      return (...target) => {
        // 装饰Class
        if (target.length === 1)
          return self.withTrackingComponentDecorator(type, id, custom)(...target);

        return self.trackEventMethodDecorator(type, id, custom)(...target);
      };

    console.error('[Monitor报错]：埋点需要埋点类型和事件ID');
  }

  // Class装饰器
  withTrackingComponentDecorator(type, id) {
    const self = this;
    return (WrappedComponent) =>
      class extends React.Component {
        componentDidMount() {
          self.processLogSerial(type, id);
        }

        componentWillUnmount() {
          self.processLogSerial(type === 'PV' ? 'PE' : 'AE', id); // 如果装饰器type为PV，则这里埋PE点；如type为AS，则这里为AE
          self.sendLog(); // 在页面或APP卸载时发送所有存在的日志
        }

        render() {
          return <WrappedComponent {...this.props} />;
        }
      };
  }

  // Class方法装饰器
  trackEventMethodDecorator(type, id, custom) {
    const self = this;
    return (target, name, describe) => {
      console.log(target, name, describe);
      const fn = describe.value;
      // eslint-disable-next-line
      describe.value = () => {
        self.processLogSerial(type, id, custom);
        fn();
      };
    };
  }

  // 事件日志侵入生成
  trackEv(type, id, custom) {
    this.processLogSerial(type, id, custom);
  }

  // 通用字段配置
  generateNormal() {
    if (!this.baseInfo) {
      // 用户
      if (this.custno === '') this.custno = getCustNo() || null;

      // 设备指纹
      this.deviceInfo = {
        ua: null, // 客户端的user agent
        os: Platform.OS, // 操作系统
        osv: Platform.Version, // 根据UA计算，操作系统版本
        dt: 'mobile', // 设备类型
        bt: null, // 浏览器类型
        btv: null, // 浏览器版本
        maccode: this.maccode || configs.maccode,
      };

      this.baseInfo = {
        custno: this.custno,
        ...this.deviceInfo,
        utm: this.utm,
        name: this.appName, // 应用名称，如trade_pc
        av: this.appVersion, // App版本号
        sv: this.version, // SDK版本
        title: '',
        domain: '',
        url: null,
        // sc:
        //   window
        //   && window.screen
        //   && `${window.screen.width}X${window.screen.height}`, // 屏幕尺寸/分辨率
        // dpi: window.devicePixelRatio || '', // 设备像素比
        accptmd: configs.accptMd, // 终端类型 1 -> PC ;  2 -> iOS;  3 -> Android ;  4 -> H5;  5 -> 微信小程序
      };
    }
  }

  // 变更用户信息
  setUser(custno) {
    this.custno = custno;
    this.baseInfo = { ...this.baseInfo, custno };
  }

  // 设置流量来源
  setUTM(source) {
    this.utm = source;
    this.baseInfo = { ...this.baseInfo, utm: source };
  }

  // 设置设备指纹，当项目在如APP能通过JSBridge获取时，可以自定义设置设备指纹信息
  setDeviceInfo(deviceInfo) {
    this.deviceInfo = {
      ...this.deviceInfo,
      ...deviceInfo,
    };
    this.baseInfo = {
      ...this.baseInfo,
      ...this.deviceInfo,
    };
  }

  // 专供函数组件使用的PV/PE埋点hooks，在函数组件中调用 monitor.useTrack('123', {}); force表示是否立即发送
  useTrack(id, custom, force = false) {
    useEffect(() => {
      this.processLogSerial('PV', id, custom, force);
      return () => {
        this.processLogSerial('PE', id, custom, force);
      };
    }, []);
    return [];
  }
}

export default new Monitor();
