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
    let ticket_thread_id = `tokped-thread-${userid}-${msg.shop_id}-${brand_id}`;
    let author_external_id = Buffer.from(`tokped::${userid}`).toString('base64');
    let product_id = msg.payload.product.product_id;
    let attachment_type = msg.payload.attachment_type;
    let ticket_external_id = `tokped-ticket-${userid}-${msg.msg_id}-${Date.now()}`;
    let msg_encode;
    let msg_content = msg.message;
    if (attachment_type == 3) {
      let product_encode = msg.payload.product.product_url.toString('base64')
      ticket_external_id = `tokped-ticket-${userid}-${msg.msg_id}-${product_encode}`;
      // let html_msg_content = '';
      // html_msg_content = html_msg.productHtml(msg.payload.product.name, msg.payload.product.price, msg.payload.product.product_url)
      msg_content = `Product: ${product_id}\nProduct URL : ${msg.payload.product.product_url}`
      // msgObj['html_message'] = html_msg_content
      msgObj['display_info'] = [{
        type: 'product',
        data: {
          id: product_id,
          url: msg.payload.product.product_url,
          name: msg.payload.product.name
        }
      }]
    } else if (attachment_type == 2) {
      let image_url = msg.payload.image.image_url;
      // let ext = mime.extension(mime.lookup(image_url))
      msgObj['file_urls'] = [`/api/v1/file/image.jpeg?source=${image_url}`]
    } else if (attachment_type == 0) {
      msg_encode = msg.message.toString('base64')
      ticket_external_id = `tokped-ticket-${userid}-${msg.msg_id}-${msg_encode}`;
    }
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