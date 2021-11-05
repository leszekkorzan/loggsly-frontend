import React from 'react';
import Setup from '../components/Setup';
import System from '../components/System';
import {useGlobalState} from '../components/state';
const Dashboard = () => {
    const [logged] = useGlobalState('logged')
    if(window.localStorage.getItem('csv_url') !== null || logged){
        return <System/>
    }else{
        return <Setup/>
    }
}
export default Dashboard