import React, {useState, useEffect} from 'react';
import aes from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8'
import {CircularProgress, Alert, AlertTitle, Button, Box} from '@mui/material';
import Papa from 'papaparse';
import Passes from './Passes';

const Connect = () => {
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState(false)
    const [data, setData] = useState(null)

    const password = window.atob(window.sessionStorage.getItem('pass'));
    var URLbytes  = aes.decrypt(window.localStorage.getItem('csv_url'), password);
    var URL = URLbytes.toString(enc);

    useEffect(() => {
        Papa.parse(URL, {
            download: true,
            header: true,
            error: function() {
                setLoading(false)
                setErr(true)
            },
            complete: function(results) {
                setLoading(false)
                if(results){
                    var data = results.data
                    if(['website','login','password','category'].every(elm => results.meta.fields.includes(elm))){
                        setErr(false)
                        setData(data)
                        window.sessionStorage.setItem('csv_data',JSON.stringify(data))
                    }else{
                        setErr(true)
                    }
                }else{
                    setErr(true)
                }
            }
        })
     }, []);
    return(
        <>
            {loading && <CircularProgress sx={{marginLeft:'auto',marginRight:'auto'}}/>}
            {err &&
            <Box sx={{marginLeft:'auto',marginRight:'auto',maxWidth:'400px'}}>
                <Alert sx={{textAlign:'left'}} severity="error" >
                    <AlertTitle>Error</AlertTitle>
                    An error has occurred with the database!
                </Alert>
                <Button sx={{m:1,textAlign:'center'}} variant='outlined' href='/reset'>Reset config</Button>
            </Box>
            }
            {data!==null && !err ? <Passes data={data} pass={password}/> : null}
        </>
    )
}
export default Connect;