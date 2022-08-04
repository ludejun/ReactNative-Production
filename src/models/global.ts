import { createModel } from '@rematch/core';
import { RootModel } from '.';

interface IGlobal {
  isShow: boolean; // 全局失败Modal是否展示，目前没有使用
  toastGlobal: {
    toastMsg: string;
    toastVisible: boolean;
  }; // 全局toast的信息
  needFaceId: boolean; // 是否需要FaceId/手势验证，默认需要；当登录的时候不需要
  jPushId: string; // 当前jPushId
}

export const global = createModel<RootModel>()({
  state: {
    isShow: false,
    toastGlobal: {
      toastMsg: 'toast tips',
      toastVisible: false,
    },
    needFaceId: true,
    jPushId: '',
  } as IGlobal, // initial state
  reducers: {
    changeFaceId(state: IGlobal, isFaceId = false) {
      return {
        ...state,
        isFaceId,
      };
    },
    // handle state changes with pure functions
    failModal(state: IGlobal) {
      return {
        ...state,
        isShow: true,
      };
    },
    showToastGlobal(state: IGlobal, toastMsg = 'pleace enter show toast message') {
      return {
        ...state,
        toastGlobal: {
          toastMsg,
          toastVisible: true,
        },
      };
    },
    hideToastGlobal(state: IGlobal) {
      return {
        ...state,
        toastGlobal: {
          ...state.toastGlobal,
          toastVisible: false,
        },
      };
    },
    setJPushID(state: IGlobal, payload: string) {
      return {
        ...state,
        jPushId: payload,
      };
    },
  },
});
