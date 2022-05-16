import { createGlobalState } from 'react-hooks-global-state';

const { setGlobalState, useGlobalState } = createGlobalState({
  logged: false,
  lang: 'pl'
});
export { useGlobalState, setGlobalState };
