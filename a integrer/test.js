const axios = require('axios').default;
const WebSocket = require('ws');

const HTTP_CLIENT = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
    Cookie: "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiamUiLCJpYXQiOjE1NzUzODcxNTR9.spu1J5izQRS4uPj_SYAxWncLQlmAWVleTsGhCYO82Hs; path=/; domain=localhost; HttpOnly; Expires=Sat, 21 Dec 2019 21:09:03 GMT;"
  }
});

(async function () {

  const wss = new WebSocket('ws://localhost:8090/game',{
    headers: {
      Cookie: "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiamUiLCJpYXQiOjE1NzUzODcxNTR9.spu1J5izQRS4uPj_SYAxWncLQlmAWVleTsGhCYO82Hs; path=/; domain=localhost; HttpOnly; Expires=Sat, 21 Dec 2019 21:09:03 GMT;"
    }
  })
  
  wss.on('message', function incoming(data) {
    console.log('eee',data);
    //console.log(JSON.parse(data))
  });
})().catch((err) => {
  console.log('tt',err)
})
