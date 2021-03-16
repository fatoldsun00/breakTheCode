import axios from 'axios'

export const HTTP = axios.create({
  baseURL: "http://localhost:7890/api",
  withCredentials: true, // gestion cookies coté server
  headers: {
    'Content-Type': 'application/json'
  }
})

HTTP.interceptors.response.use((response) => {
  console.log('ici',response)
  return response;
}, function (error) {
  console.log('ici',error,error.response,error.response.status,error.request)

  // Error 😨
  /* eslint-disable no-console */
  if (error.response) {
      // Do something with response error
    if (error.response.status === 401) {
      console.log('unauthorized, logging out ... TODO');
    }
} else if (error.request) {
    console.log(error.request);
} else {
    console.log('Error', error.message);
}
  return Promise.reject(error.response);
});