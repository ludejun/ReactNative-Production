import { createModel } from '@rematch/core';
import { RootModel } from '.';
import { Payload } from '../middleware/wrapperRequest';
import { UserInfo } from '../utils';

type IloginState = {
  loginLoading: boolean;
  userInfo: UserInfo | null;
  logoutLoading: boolean;
};
const loginState: IloginState = {
  loginLoading: false,
  userInfo: null,
  logoutLoading: false,
};

export const login = createModel<RootModel>()({
  state: loginState,
  reducers: {
    loginClear: () => ({
      ...loginState,
    }),
    logout: (state, payload: Payload<{}>) => ({
      ...state,
      logoutLoading: payload.loading,
      userInfo: null,
    }),
    login: (state, payload: Payload<UserInfo>) => ({
      ...state,
      loginLoading: payload.loading,
      ...(payload.status === 'success' ? { userInfo: payload.data } : null),
    }),
    loadUserInfoFromStorage: (state, payload: UserInfo) => ({
      ...state,
      userInfo: payload,
    }),
  },
});
