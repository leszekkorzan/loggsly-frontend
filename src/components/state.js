import {createGlobalState} from 'react-hooks-global-state';
const {setGlobalState, useGlobalState} = createGlobalState({
    logged:false
})
export {useGlobalState,setGlobalState};