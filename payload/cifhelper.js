var mime = require('mime-types');
const axios = require('axios');
// const LOGGLY_TOKEN = process.env.LOGGLY_TOKEN || '25cbd41e-e0a1-4289-babf-762a2e6967b6';
// var winston = require('winston');
// var { Loggly } = require('winston-loggly-bulk');
// let clientName = 'UNITEL'

// winston.add(new Loggly({
//   token: LOGGLY_TOKEN,
//   subdomain: "diastowo",
//   tags: ["cif"],
//   json: true
// }));

const cifPayload = async function (msg, brand_id, user_ticket_id, product_field_id) {
    var msgObj = {};
    let username = msg.full_name
    let userid = msg.user_id
    let ticket_external_id = `tokped-ticket-${userid}-${msg.msg_id}-${Date.now()}`;
    let ticket_thread_id = `tokped-thread-${userid}-${msg.shop_id}-${brand_id}`;
    let author_external_id = Buffer.from(`tokped::${username}::${userid}`).toString('base64');
    let product_id = msg.payload.product.product_id;
    // let msg_type = msg.type;
    let msg_content = msg.message;
    msgObj = {
        external_id: ticket_external_id,
        thread_id: ticket_thread_id,
        created_at: new Date().toISOString(),
        message: msg_content,
        author: {
            external_id: author_external_id,
            name: username
        },
        fields:[{
            id: 'subject',
            value: 'Incoming Tokopedia Chat from: ' + username
        },{
            id: user_ticket_id.toString(),
            value: userid
        }, {
            id: product_field_id.toString(),
            value: product_id
        }],
        allow_channelback: true
    }
    if (product_id != 0) {
      let html_msg_content = '';
      html_msg_content = productHtml(msg.payload.product.image_url, msg.payload.product.name, msg.payload.product.price)
      msg_content = 'Product'
      msgObj['html_message'] = html_msg_content
      msgObj['display_info'] = [{
        type: 'product',
        data: {
          id: product_id,
          url: msg.payload.product.image_url,
          name: msg.payload.product.name
        }
      }]
    }

//   if (msg_type == 'text') {
//     if (msg_content == '') {
//         msg_content = '- empty message -'
//     }
//     msgObj['message'] = msg_content;
//   } else {
//     let ext = mime.extension(mime.lookup(msg_content))
//     var fileMessage = '';
//     if (!ext) {
//       if (msg_type == 'image') {
//         fileMessage = `${msg_type} from User`
//         ext = 'jpeg';
//       } else if (msg_type == 'video') {
//         fileMessage = `${msg_type} from User`
//         ext = 'mp4';
//       } else {
//         if (msg_type == 'file') {
//           var tFile;
//           try {
//             tFile = await axios.get(decodeURIComponent(msg_content))
//             if (mime.extension(tFile.headers['content-type'])) {
//               fileMessage = `${msg_type} from User`
//               ext = mime.extension(tFile.headers['content-type']);
//             } else {
//               fileMessage = `Unsupported ${msg_type} from User`;
//             }
//           } catch (err) {
//             fileMessage = `Error getting ${msg_type} from User`;
//             goLogging('error', 'FILE', msg.from.id, err, username);
//           }
//         }
//       }
//     } else {
//       fileMessage = `${msg_type} from User`;
//     }
//     msgObj['message'] = fileMessage;
//     if (ext) {
//       msgObj['file_urls'] = [`/api/v1/cif/file/users-file.${ext}?source=${msg_content}`]
//     }
//   }
  return msgObj;
}

function productHtml (image, name, price) {
  return `<html lang="en">

  <head>
    <style>
    /* 
* Design by Robert Mayer:https://goo.gl/CJ7yC8
*
*I intentionally left out the line that was supposed to be below the subheader simply because I don't like how it looks.
*
* Chronicle Display Roman font was substituted for similar fonts from Google Fonts.
*/

body {
  background-color: #fdf1ec;
}

.wrapper {
  overflow-y: hidden !important;
  height: 220px !important;
  width: 654px;
  border-radius: 7px 7px 7px 7px;
  /* VIA CSS MATIC https://goo.gl/cIbnS */
  -webkit-box-shadow: 0px 14px 32px 0px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 14px 32px 0px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 14px 32px 0px rgba(0, 0, 0, 0.15);
}

.product-img {
  float: left;
  height: 420px;
  width: 327px;
}

.product-img img {
  border-radius: 7px 0 0 7px;
}

.product-info {
  float: left;
  height: 420px;
  width: 327px;
  border-radius: 0 7px 10px 7px;
  background-color: #ffffff;
}

.product-text {
  height: 300px;
  width: 327px;
}

.product-text h1 {
  margin: 0 0 0 38px;
  padding-top: 22px;
  font-size: 20px;
  color: #474747;
}

.product-text h1,
.product-price-btn p {
  font-family: 'Bentham', serif;
}

.product-text h2 {
  margin: 0 0 47px 38px;
  font-size: 13px;
  font-family: 'Raleway', sans-serif;
  font-weight: 400;
  text-transform: uppercase;
  color: #d2d2d2;
  letter-spacing: 0.2em;
}

.product-text p {
  height: 125px;
  margin: 0 0 0 38px;
  font-family: 'Playfair Display', serif;
  color: #8d8d8d;
  line-height: 1.7em;
  font-size: 15px;
  font-weight: lighter;
  overflow: hidden;
}

.product-price-btn {
  height: 103px;
  width: 327px;
  margin-top: 17px;
  position: relative;
}

.product-price-btn p {
  display: inline-block;
  position: absolute;
  top: -13px;
  height: 50px;
  font-family: 'Trocchi', serif;
  margin: 0 0 0 38px;
  font-size: 28px;
  font-weight: lighter;
  color: #474747;
}

span {
  display: inline-block;
  height: 50px;
  font-family: 'Suranna', serif;
  font-size: 34px;
}

.product-price-btn button {
  float: right;
  display: inline-block;
  height: 50px;
  width: 176px;
  margin: 0 40px 0 16px;
  box-sizing: border-box;
  border: transparent;
  border-radius: 60px;
  font-family: 'Raleway', sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #ffffff;
  background-color: #9cebd5;
  cursor: pointer;
  outline: none;
}

.product-price-btn button:hover {
  background-color: #79b0a1;
}
    </style>
    <link href="https://fonts.googleapis.com/css?family=Bentham|Playfair+Display|Raleway:400,500|Suranna|Trocchi" rel="stylesheet">
  </head>
  
  <body>
    <div class="wrapper">
      <div class="product-info">
        <div class="product-text">
          <h1>${name}</h1>
        </div>
        <div class="product-price-btn">
          <p><span>${price}</span></p>
        </div>
        <div style="height: 103px;margin-top: 17px;width: 327px;padding-left: 38px;">
          <button class="btn btn-warning">See Product</button>
        </div>
      </div>
    </div>
  
  </body>
  
  </html>`
}

const fileExtValidator = function (zdFile) {
    var fileType = '';
    switch (mime.lookup(zdFile)) {
      case 'image/jpeg':
        fileType = 'image'
        break;
      case 'image/png':
        fileType = 'image'
        break;
      case 'video/mp4':
        fileType = 'video'
        break;
      case 'video/mpeg':
        fileType = 'video'
        break;
      default:
        fileType = 'file'
        break;
    }
    return fileType;
}

function goLogging(status, process, to, message, name) {
//   winston.log(status, {
//     process: process,
//     status: status,
//     to: to,
//     username: name,
//     message: message,
//     client: clientName
//   });
}

module.exports = {
    cifPayload,
    fileExtValidator
}