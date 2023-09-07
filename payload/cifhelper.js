var mime = require('mime-types');
let html_msg = require('../payload/html_helper')
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

const cifDiscussionPayload = async function (payload, brand_id, user_ticket_id, product_field_id) {
  var msgObj = {};
  let userid = payload.discussion_data.user_id
  let username = payload.discussion_data.user_full_name == undefined ? `Tokopedia User ${userid}` : payload.discussion_data.user_full_name;
  let ticket_thread_id;
  let ticket_external_id;
  if (payload.discussion_type == 'NewQuestion') {
     ticket_thread_id = `tokped-thread-dc-${userid}-${payload.discussion_data.shop_id}-${payload.discussion_data.id}`;
     ticket_external_id = `tokped-ticket-dc-${userid}-${payload.discussion_data.id}-${Date.now()}`;
  } else {
     ticket_thread_id = `tokped-thread-dc-${userid}-${payload.discussion_data.shop_id}-${payload.discussion_data.question_id}`;
     ticket_external_id = `tokped-ticket-dc-${userid}-${payload.discussion_data.answer_id}-${Date.now()}`;
  }
  let author_external_id = Buffer.from(`tokped::${userid}`).toString('base64');
  let product_id = payload.discussion_data.product_id;
  // let msg_type = payload.type;
  let msg_content = payload.discussion_data.message;
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
          value: 'Incoming Tokopedia Discussion from: ' + username
      },{
          id: user_ticket_id.toString(),
          value: userid
      }, {
          id: product_field_id.toString(),
          value: product_id
      }],
      allow_channelback: true
  }
  return msgObj;
}

const cifPayload = async function (msg, brand_id, user_ticket_id, product_field_id) {
    var msgObj = {};
    let username = msg.full_name
    let userid = msg.user_id
    let ticket_external_id = `tokped-ticket-${userid}-${msg.msg_id}-${Date.now()}`;
    let ticket_thread_id = `tokped-thread-${userid}-${msg.shop_id}-${brand_id}`;
    let author_external_id = Buffer.from(`tokped::${userid}`).toString('base64');
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
      html_msg_content = html_msg.productHtml(msg.payload.product.image_url, msg.payload.product.name, msg.payload.product.price)
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
    cifDiscussionPayload,
    fileExtValidator
}