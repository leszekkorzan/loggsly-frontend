import React from 'react';
import Setup from '../components/Setup';
import System from '../components/System';

const Dashboard = () => {
    if(window.localStorage.getItem('pass') !== null && window.localStorage.getItem('csv_url') !== null){
        return <System/>
    }else{
        return <Setup/>
    }
}
export default Dashboard