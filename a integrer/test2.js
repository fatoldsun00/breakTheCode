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
  let rep
  try {
    rep = await HTTP_CLIENT.get('http://localhost:7890/api/user/me')

    //console.log("llaalalala",rep);
  } catch (err) {
    console.log("erreur",err);
  }
  //console.log(rep);
  
  //console.log(rep);
  rep = await HTTP_CLIENT.post('http://localhost:7890/api/game/join/eonqghcvm')
  //console.log(rep);
  //rep = await HTTP_CLIENT.post('http://localhost:7890/api/game/pickupCard/eonqghcvm/1')
  //console.log(rep);

})().catch((err) => {
  console.log('tt',err)
})
