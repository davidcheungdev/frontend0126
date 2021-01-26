import React, { useEffect, useState } from 'react'
import config from '../config';
import './Home.css'
import InfoPanel from '../components/Info'
import Card from '../components/Card'

function Home() {
  const [data, setData] = useState({
    info: {},
    error: null,
  })

  const [status, setStatus] = useState({
    code: 'Checking...',
  })

  const [privateState, setPrivateData] = useState({
    isLoading: true,
    data: {},
  });

  const fetchPrivateData = async(data) =>  {
    const uri = `${config.backendURL}/auth/userInfo`
    const resp = await fetch(uri,{credentials : "include"});
    return {
      data: await resp.json(),
    }
  }

  const fetchInfoPanel = async() => {
    const resp = await fetch(`${config.backendURL}/status/about`, { credentials: "include" });
    const code = resp.status
    const info = await resp.json()
    return { code, info };
  };


useEffect(() => {
  fetchInfoPanel().then(({code, info}) => {
      setStatus({ code });
      setData({ info, error: null })
    })
    .catch((error) => {
      setData({ info: {}, error: error })
    });

    fetchPrivateData().then(setPrivateData);
}, [])

  return (
    <main className="Home">
      <InfoPanel data={data} status={status} config={config} />

      <Card header="Authenticated Data">
        {
          privateState.isLoading ?
            <div>Fetching data...</div> :
            <pre>{ JSON.stringify(privateState.data, null , 2) }</pre>
        }
      </Card>
    </main>
  )
}

export default Home
