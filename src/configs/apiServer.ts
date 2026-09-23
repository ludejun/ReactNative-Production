import type { Env } from '../../env';

// Typed as Record<Env, string> so a new environment cannot be added to `Env`
// without a domain here — `local` and `bcp` were previously missing, and
// resolved to undefined at runtime.
export const apiServer: Record<Env, string> = {
  local: 'http://localhost:8000',
  dev: 'http://localhost:8000',
  sit: '',
  testin: '',
  uat: '',
  prod: '',
  mock: '',
  bcp: '',
};
