import helper from '../assets/helper';

const ApiUrl = helper.server_url + 'api/';

async function perform(code, details){
  return fetch(ApiUrl+code, {
  method: 'POST',
  timeout: 4000,    
  headers: {
  'Accept': 'application/json',    
  'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: JSON.stringify(details)})
  .then((response) => response.json())
  // .then((response) => response.text())
  .then((res) => {
    // console.log(res)
    // return JSON.parse(res);
    return res;
  })
  .catch((error)=>{
    console.log(error)
    return false;
  });
}

async function perform2(code){  
  const BusKhabriApi = 'https://buskhabri.com/api/';
  const link = BusKhabriApi+code+'&hash=mij12jnc8';
  return fetch(link, {
    method: 'GET',
    timeout: 4000
  }).then((response) => response.json())
  // .then((response) => response.text())
  .then((res) => {
    // console.log(res)
    // return JSON.parse(res);
    return res;
  })
  .catch((error)=>{
    console.log(error)
    return false;
  });
}

export {
  perform,
  perform2
}