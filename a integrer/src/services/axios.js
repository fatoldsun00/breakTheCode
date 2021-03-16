const axios = require('axios')
const { prestashop } = require('../config')


//import store from './store'

const apiToPrestashop = axios.create({
  baseURL: `http://${prestashop.baseURL}/${prestashop.apiURL}`, 
  headers: {
    'Content-Type': 'application/xml',
    'Authorization': ' Basic '+Buffer.from(prestashop.apiOutUsername+":"+prestashop.apiOutPassword).toString('base64')},
})

const HTTPAckPrestashop = axios.create({
  baseURL: `http://${prestashop.baseURL}/${prestashop.apiURL}/`, 
  headers: {
    'Content-Type': 'application/xml',
    'Authorization': ' Basic '+Buffer.from(prestashop.apiOutUsername+":"+prestashop.apiOutPassword).toString('base64')},
})

//Mise en forme du paquet XML
HTTPAckPrestashop.interceptors.request.use((req) => {
  req.data = HTTPAckPrestashop.generateAckXML(req.data)
  return req
})

HTTPAckPrestashop.generateAckXML = (queue)=>{
  return `
  <prestashop xmlns:xlink='http://www.w3.org/1999/xlink'>
      <queue>
          <id>${queue.id_queue}</id>
          <http_status>${queue.http_status}</http_status>
          <ask>${queue.ask?1:0}</ask>
          <treated>${queue.treated?1:0}</treated>
          <ack>${queue.ack?1:0}</ack>
          <error>${queue.error?1:0}</error>
          <message_error>${queue.message_error}</message_error>
      </queue>
  </prestashop>`}

HTTPAckPrestashop.generateEmptyAckXML = (queue)=>{
    return `
    <prestashop xmlns:xlink='http://www.w3.org/1999/xlink'>
        <queue>
           
        </queue>
    </prestashop>`}

module.exports = {
    apiToPrestashop,
    HTTPAckPrestashop
}