import { Models } from '@rematch/core';
import { global } from './global';
import { login } from './login';
import { home } from './home';

export interface RootModel extends Models<RootModel> {
  global: typeof global;
  login: typeof login;
  home: typeof home;
}

export const models: RootModel = {
  global,
  login,
  home,
};
