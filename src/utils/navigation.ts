import { createRef } from 'react';
export const navigationRef = createRef<any>(); // NavigationContainerRef，在App中定义

export const navigate = (name: string, params = {}) =>
  navigationRef.current?.navigate(name, params);

// ！important -> TODO 下面的name等string需要根据业务路由定义而定
/**
 * reset：不希望用户可以返回之前的页面，一般用在一个流程的结果页
 * 默认reset到Login登录页，可以reset到其他页，但是如果结果页有返回按钮，将无法返回；这个时候需要用下面的resetHome等函数
 * @param name options 需要reset到的路由名字，定义在App中
 * @param params options 跳转此路由携带的参数，比如跳转到Login页需要携带登录完reset到那个页面的参数
 * @returns
 */
export const reset = (name = 'Login', params = { resetName: 'HomeTab' }) => {
  navigationRef.current?.reset({
    index: 0,
    routes: [{ name, params }],
  });
};

/**
 * 默认是reset到首页，但是可以添加第二个参数为stack格式的object数组，用处是当reset到最终页面，但是最终页面是栈顶无法点击返回按钮，可以在中间添加HomeTab作为中间夹层
 * stack中object格式: {name: 'Webview', params: { url: 'https://abc'}}
 * @param finalRoute options 可以不传就到HomeTab页
 */
export const resetHome = (
  finalRoute: { name: string; params?: unknown; state?: unknown }[] | undefined = [],
) => {
  navigationRef.current?.reset({
    index: 0,
    routes: [{ name: 'HomeTab' }, ...finalRoute],
  });
};

export const resetNavigation = (resetName = 'HomeTab', params = {}) => {
  navigationRef.current?.reset({
    index: 0,
    routes: [{ name: resetName, params }],
  });
};

export const resetUserInfo = ({
  reset,
}: {
  reset: ({ index, routes }: { index: number; routes: [{ name: string }] }) => void;
}) => {
  reset({
    index: 0,
    routes: [{ name: 'HomeTab' }],
  });
};

export const resetLoginHome = ({
  reset,
}: {
  reset: ({ index, routes }: { index: number; routes: [{ name: string; params: {} }] }) => void;
}) => {
  reset({
    index: 0,
    routes: [{ name: 'LoginPersonal', params: { resetName: 'HomeTab' } }],
  });
};

export const resetUserInfoTab = ({
  reset,
}: {
  reset: ({
    index,
    routes,
  }: {
    index: number;
    routes: [
      {
        name: string;
        state: {
          routes: [
            {
              name: string;
            },
          ];
        };
      },
    ];
  }) => void;
}) => {
  reset({
    index: 0,
    routes: [{ name: 'HomeTab', state: { routes: [{ name: 'UserInfoScreen' }] } }],
  });
};
