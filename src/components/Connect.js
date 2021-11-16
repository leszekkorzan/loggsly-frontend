import React, {useState, useEffect} from 'react';
import aes from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8'
import { Alert, AlertTitle, Button, Box } from '@mui/material';
import RingLoader from 'react-spinners/RingLoader';
import logoOnly from '../assets/logo-only-red.svg';

import Papa from 'papaparse';
import Passes from './Passes';

const Connect = () => {
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState(false)
    const [data, setData] = useState(null)
    const updated = window.sessionStorage.getItem('updated') || '';

    const password = window.atob(window.sessionStorage.getItem('pass'));
    var URLbytes  = aes.decrypt(window.localStorage.getItem('csv_url'), password);
    var URL = URLbytes.toString(enc);

    useEffect(() => {
        if(URL.toLowerCase().startsWith('https://script.google.com/')){
            window.fetch(URL,{
                redirect:'follow',
                method: 'POST',
                headers: {
                  'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify({type:'view'})
            }).then(res => res.json())
            .then(results => {
                setLoading(false)
                setData(results)
                window.sessionStorage.setItem('csv_data',JSON.stringify(results))
                window.sessionStorage.setItem('API_fetch',true);
            })
            .catch(() => {
                setLoading(false)
                setErr(true)
            });
        }else{
            setTimeout(()=>{
                Papa.parse(`${URL}&_=${updated}`, {
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
            },1300)
        }
     }, []);
    return(
        <>
            {loading && (
                <>
                <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',height:'50vh'}}>
                    <RingLoader css={{marginRight:'25px',marginBottom:'25px'}} color='#ed1c25' loading={loading} size='150px' />
                    <img className='loaderImg' style={{width:'100px',position:'absolute'}} src={logoOnly} alt='Loggsly logo' />
                </Box>
                </>
            )}
            {err &&
            <Box sx={{marginLeft:'auto',marginRight:'auto',maxWidth:'400px'}}>
                <Alert sx={{textAlign:'left'}} severity="error" >
                    <AlertTitle>Błąd</AlertTitle>
                    Wystąpił problem z bazą danych!
                </Alert>
                <Button color='error' sx={{m:1,textAlign:'center'}} variant='outlined' href='/reset'>reset ustawień</Button>
            </Box>
            }
            {data!==null && !err ? <Passes data={data} pass={password}/> : null}
        </>
    )
}
export default Connect;