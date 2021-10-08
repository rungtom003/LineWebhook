const keygen = require("keygenerator");
const axios = require('axios');
let message = "แจ้งซ่อม:ทดสอบการเเจ้งซ่อม"
let subMessage = message.slice(0,9);
let payload = message.slice(10);
console.log(subMessage)
if(subMessage === "แจ้งซ่อม:")
{
    console.log("ผ่าน")
}
else
{
    console.log("ไม่ผ่าน")
}