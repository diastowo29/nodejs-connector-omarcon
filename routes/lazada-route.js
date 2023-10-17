var express = require('express');
const axios = require('axios');
const zdSvc = require('../payload/zendesk')
const tokped = require('../payload/tokopedia')
var router = express.Router();
var cif = require('../payload/cifhelper')
var url = require("url");
const db = require("../models");
const connection = db.zdConnection; // GANTI
require('dotenv').config()

var tokpedHost = process.env.TOKPED_HOST;
// let ZD_PUSH_ID = process.env.ZD_PUSH_ID;
// let ZD_PUSH_TOKEN = process.env.ZD_PUSH_TOKEN;
let proxyUrl = process.env.QUOTAGUARDSTATIC_URL;

router.get('/test', function(req, res, next) {
    res.status(200).send({
        tokped_host: tokpedHost,
        zd_push_id: ZD_PUSH_ID,
        zd_push_token: ZD_PUSH_TOKEN,
        zd_push_api: ZD_PUSH_API,
        proxy_username: url.parse(proxyUrl).auth.split(':')[0],
        proxy_password: url.parse(proxyUrl).auth.split(':')[1],
        proxy_host: url.parse(proxyUrl).hostname,
        proxy_port: url.parse(proxyUrl).port
    })
})

router.get('/callback', function(req, res, next) {
    res.status(200).send();
    // GET CODE
    // CALL LAZADA API TO GENERATE ACCESS_TOKEN
})

router.post('/chat', async function(req, res, next) {
    let cifPayload = await (cif.cifPayload(req.body, 0, 0, '22587396407065'));
	let external_resource_array = [cifPayload];
    let shop_id = req.body.shop_id;
    connection.findOne({
        where: {
            shop_id: shop_id,
            status: 'ready'
        }
    }).then(function(conn) {
        if (conn != null) {
            try {
                let auth = `Bearer ${conn.zd_pushtoken}`
                let axiosPayload = zdSvc.pushConversationPayload(conn.zd_instance, auth, conn.zd_pushid, external_resource_array)
                // res.status(200).send(axiosPayload)
                axios(axiosPayload).then((response) => {
                    res.status(200).send(response.data)
                }, (error) => {
                    res.status(error.response.status).send({error: error})
                })
            } catch (e) {
                res.status(500).send({error: 'crashed'})
            }
        } else {
            res.status(400).send({error: 'shop not ready'})
        }
    })
});

router.post('/discussion', async function(req, res, next) {
    // console.log(JSON.stringify(req.body))
    let cifPayload = await (cif.cifDiscussionPayload(req.body, 0, 0, '22587396407065'));

    /* === REPLY TO DISCUSSION NOT YET SUPPORTED */
	/* let external_resource_array = [cifPayload];
    let auth = `Bearer ${ZD_PUSH_TOKEN}`
    try {
        let axiosPayload = zdSvc.pushConversationPayload(ZD_PUSH_API, auth, ZD_PUSH_ID, external_resource_array)
        // res.status(200).send(axiosPayload)
        axios(axiosPayload).then((response) => {
            res.status(200).send(response.data)
        }, (error) => {
            res.status(error.response.status).send({error: error})
        })
    } catch (e) {
        res.status(500).send({error: 'crashed'})
    } */
    /* === REPLY TO DISCUSSION NOT YET SUPPORTED */

    res.status(200).send(cifPayload);
});

router.post('/channelback', async function(req, res, next) {
	// let recipient = Buffer.from(req.body.recipient_id, 'base64').toString('ascii');
    let fsId = process.env.TOKPED_APPS_ID;
    let msgId = req.body.parent_id.split('-')[3];
    let shopId = req.body.thread_id.split('-')[3];
    let metadata = JSON.parse(req.body.metadata)
    
    // console.log(tokped.replyMessagePayload(fsId, msgId, shopId, req.body.message, metadata.token));
    let reply = await axios(tokped.replyMessagePayload(fsId, msgId, shopId, req.body.message, metadata.token))
    if (reply.status == 200) {
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
