import { createModel } from '@rematch/core';
import { RootModel } from '.';

interface IHome {
  homePage: {} | null;
  fetchHomeLoading: boolean;
}

export const home = createModel<RootModel>()({
  state: {
    homePage: null,
    fetchHomeLoading: false,
  } as IHome,
  reducers: {
    fetchHome(
      state: IHome,
      payload: {
        loading: boolean
        status: 'success' | 'start' | 'error'
        data: {
          count: number;
        }
      },
    ) {
      return {
        ...state,
        fetchHomeLoading: payload.loading,
        ...(payload.status === 'success'
          ? {
            homePage: payload.data,
          }
          : null),
      };
    },
  },
});
