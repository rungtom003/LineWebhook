const keygen = require("keygenerator");
const axios = require('axios');
let message = `แจ้งซ่อม:คอมพัง`
let subMessage = message.slice(0,9);
let vavel = message.search("ระดับ:");
let vavelSub = message.slice(vavel,vavel+6)
let payloadvavel = message.slice(vavel+6);
let payload = message.slice(9,vavel);

let pic = []
for(let i = 1 ; i <= 5 ; i++)
{
    if(Number(payloadvavel) >= i)
    {
        pic.push(1)
    }
    else
    {
        pic.push(0)
    }
}
if(vavel < 0)
{
    payload = message.slice(9);
}
console.log(vavel)
console.log(payload)

// if(subMessage === "แจ้งซ่อม:")
// {
//     console.log("ผ่าน")
// }
// else
// {
//     console.log("ไม่ผ่าน")
//}