var express = require('express');
const axios = require('axios');
const zdSvc = require('../payload/zendesk')
const tokped = require('../payload/tokopedia')
var router = express.Router();
var cif = require('../payload/cifhelper')
require('dotenv').config()

var tokpedHost = process.env.TOKPED_HOST;
let ZD_PUSH_ID = process.env.ZD_PUSH_ID;
let ZD_PUSH_TOKEN = process.env.ZD_PUSH_TOKEN;
const ZD_PUSH_API = process.env.ZD_PUSH_API || 'https://pdi-rokitvhelp.zendesk.com/api/v2/any_channel/push'; //ENV VARIABLE

router.get('/manifest', function(req, res, next) {
    let host = req.hostname
    res.send({
      name: "eCommerce Chat",
      id: "trees-emarcon-chat-integration",
      author: "Trees Solutions",
      version: "v1",
      push_client_id: "zd_trees_integration",
      channelback_files: true,
      create_followup_tickets: false,
      urls: {
        admin_ui: "https://" + host + "/api/v1/admin",
        channelback_url: "https://" + host + "/api/v1/channelback"
      }
    })
});

router.get('/admin', function(req, res, next) {
    res.render('admin', {
      title: 'Unitel CIF Admin',
      return_url: 'return_url',
      instance_push_id: 'instance_push_id',
      zendesk_access_token: 'zd_token',
      locale: 'locale',
      subdomain: 'subdomain'
    });
  })
  
  router.post('/admin', function(req, res, next) {
    let instance_push_id = req.body.instance_push_id
    let zd_token = req.body.zendesk_access_token
    let locale = req.body.locale
    let subdomain = req.body.subdomain
    let return_url = req.body.return_url
  
    res.render('admin', {
      title: 'CIF Admin',
      return_url: return_url,
      instance_push_id: instance_push_id,
      zendesk_access_token: zd_token,
      locale: locale,
      subdomain: subdomain
    });
  })
  
  router.post('/add', async function(req, res, next) {
    let metadata = {};

    let token = await axios({
        method: 'POST',
        url: 'https://accounts.tokopedia.com/token?grant_type=client_credentials',
        headers: {
            'Authorization': 'Basic ' + new Buffer.from(process.env.TOKPED_CLIENT_ID + ":" + process.env.TOKPED_CLIENT_SECRET).toString("base64")
        }
    })

    metadata['instance_push_id'] = req.body.instance_push_id;
    metadata['zendesk_access_token'] = req.body.zendesk_access_token;
    metadata['client_id'] = process.env.TOKPED_CLIENT_ID
    metadata['client_secret'] = process.env.TOKPED_CLIENT_SECRET
    metadata['token'] = token.data.access_token
    metadata['subdomain'] = req.body.subdomain;
    metadata['locale'] = req.body.locale;
    metadata['return_url'] = req.body.return_url;
    metadata['bot_name'] = req.body.bot_name;

    let name = "Tokopedia Store : " + req.body.bot_name
    res.render('confirm', {
        title: 'CIF Confirmation Page',
        return_url: req.body.return_url,
        metadata: JSON.stringify(metadata),
        state: JSON.stringify({}),
        name: name
    });
  })
  
  router.post('/pull', function(req, res, next) {
      res.status(200).send();
  })

/* GET home page. */
router.post('/chat', async function(req, res, next) {
    let cifPayload = await (cif.cifPayload(req.body, 0, 0, '22587396407065'));
	let external_resource_array = [cifPayload];
    let auth = `Bearer ${ZD_PUSH_TOKEN}`
    let axiosPayload = zdSvc.pushConversationPayload(ZD_PUSH_API, auth, ZD_PUSH_ID, external_resource_array)
    axios(axiosPayload).then((response) => {
        res.status(200).send(response.data)
    }, (error) => {
        res.status(error.response.status).send({error: error})
    })
});

router.post('/channelback', async function(req, res, next) {
    // let username = recipient.split('::')[1];
    // let userid = recipient.split('::')[2];
    // let brandid = req.body.thread_id.split('-')[3];
    // let msgid = `tokped-ticket-${userid}-channelback-${Date.now()}`;
    
	let recipient = Buffer.from(req.body.recipient_id, 'base64').toString('ascii');
    let fsId = process.env.TOKPED_APPS_ID;
    let msgId = req.body.parent_id.split('-')[3];
    let shopId = req.body.thread_id.split('-')[3];
    let metadata = JSON.parse(req.body.metadata)
    
    // console.log(tokped.replyMessagePayload(fsId, msgId, shopId, req.body.message, metadata.token));
    let reply = await axios(tokped.replyMessagePayload(fsId, msgId, shopId, req.body.message, metadata.token))
    if (reply.status== 200) {
        res.status(200).send({external_id: reply.data.msg_id + '-' + reply.data.reply_time})
    } else {
        res.status(reply.status).send(reply.data)
    }

//   var cb_arr = [];
//   goLogging(`cif-unitel-${userid}`, 'info', 'CHANNELBACK', userid, req.body, username, '0/0');
    // if (req.body.message) {
    //     var textPayload = service.pushBackPayload(
    //         EXT_CHAT_ENDPOINT, EXT_CHAT_TOKEN, 
    //         unitel.replyPayload(msgid, 'text', req.body.message, brandid, username, userid))
    //     cb_arr.push(textPayload)
    // }
//   if (req.body['file_urls[]']) {
//     if (!Array.isArray(req.body['file_urls[]'])) {
//       req.body['file_urls[]'] = [req.body['file_urls[]']]
//     }
//     req.body['file_urls[]'].forEach(zdFile => {
//       let fileType = cifhelper.fileExtValidator(zdFile);
//       var filePayload = service.pushBackPayload(
//         EXT_CHAT_ENDPOINT, EXT_CHAT_TOKEN, 
//         unitel.replyPayload(msgid, fileType, zdFile, brandid, username, userid))
//       cb_arr.push(filePayload)
//     });
//   }

//   cb_arr.forEach((cb, i) => {
//     axios(cb).then((response) => {
//       if (response.status == 200) {
//         if (response.data.status == 'failed') {
//           if (response.data.response == 'Unauthorized') {
//             goLogging(`cif-unitel-${userid}`, 'error', 'CHANNELBACK-401', userid, req.body, username, '0/0');
//             res.status(401).send(response.data);
//           }
//         }
//         if (i == 0) {
//           goLogging(`cif-unitel-${userid}`, 'info', 'CHANNELBACK', userid, {req: req.body.request_unique_identifier, res: response.data}, username, '0/0');
//           res.status(200).send({
//             external_id: msgid
//           });	
//         }
//       }
//     }, (error) => {
//     	console.log('error')
//       console.log(JSON.stringify(error))
//       goLogging(`cif-unitel-${userid}`, 'error', 'CHANNELBACK', userid, error.response, username, '0/0');
//       if (i == 0) {
//         res.status(503).send({});
//       }
//     })
//   });
	// res.status(200).send({});	
})

router.get('/clickthrough', function(req, res, next) {
	res.status(200).send({});	
})

module.exports = router;
