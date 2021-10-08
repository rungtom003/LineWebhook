const keygen = require("keygenerator");
const axios = require('axios');
let message = "เเจ้งซ่อม:ทดสอบการเเจ้งซ่อม"
let subMessage = message.slice(0,10);
let payload = message.slice(10);
const URL = `https://script.google.com/macros/s/AKfycbyE8s1aX8unPX4osRMmMgbnmFVMLtgu2hYdNChBEPM1egjz8TwDFqmOvMfNpQsws8TEGg/exec?action=addMessage`
axios.post(URL, {
    id: `${keygen._()}`,
    message: `${payload}`
  })
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });