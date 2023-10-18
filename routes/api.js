var express = require('express');
const axios = require('axios');
const zdSvc = require('../payload/zendesk')
const tokped = require('../payload/tokopedia')
var router = express.Router();
var cif = require('../payload/cifhelper')
var url = require("url");
const db = require("../models");
var request = require('request');
const connection = db.zdConnection; // GANTI
const marketplace = db.zdMarketplaces; // GANTI
require('dotenv').config()

router.get('/test', async function(req, res, next) {
    let zdConnection = await connection.findAll();
    let zdMarketplaces = await marketplace.findAll();
    res.status(200).send({ connection: zdConnection, marketplace: zdMarketplaces })
})

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
      title: 'oMarcon CIF Admin',
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
    let token = await tokped.newToken(process.env.TOKPED_CLIENT_ID, process.env.TOKPED_CLIENT_SECRET);
    metadata['instance_push_id'] = req.body.instance_push_id;
    metadata['zendesk_access_token'] = req.body.zendesk_access_token;
    metadata['client_id'] = process.env.TOKPED_CLIENT_ID
    metadata['client_secret'] = process.env.TOKPED_CLIENT_SECRET
    metadata['token'] = token.data.access_token
    metadata['subdomain'] = req.body.subdomain;
    metadata['locale'] = req.body.locale;
    metadata['return_url'] = req.body.return_url;
    metadata['bot_name'] = req.body.integration_name;

    connection.create({
        zd_pushid: req.body.instance_push_id,
        zd_pushtoken: req.body.zendesk_access_token,
        zd_instance: req.body.subdomain,
        channel: req.body.marketType,
        shop_url: req.body.store_name,
        integration_name: req.body.integration_name,
        status: 'pending'
    }).then(function(cCreated) {
        let name = `${req.body.marketType} Store : ${req.body.integration_name}` 
        res.render('confirm', {
            title: 'CIF Confirmation Page',
            return_url: req.body.return_url,
            metadata: JSON.stringify(metadata),
            state: JSON.stringify({}),
            name: name
        });
    })
})
  
router.post('/pull', function(req, res, next) {
    res.status(200).send();
})

router.post('/chat', async function(req, res, next) {
    let cifPayload = await (cif.cifPayload(req.body, 0, 0, '22587396407065'));
	let external_resource_array = [cifPayload];
    let shop_id = req.body.shop_id;
    console.log(Date.now())
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
                console.log(JSON.stringify(cifPayload))
                axios(axiosPayload).then((response) => {
                    res.status(200).send(response.data)
                    console.log(JSON.stringify(response.data))
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
    let fsId = process.env.TOKPED_APPS_ID;
    let metadata = JSON.parse(req.body.metadata);
    tokped.replyMessagePayload(fsId, req.body, metadata.token).then(function(reply) {
        if (reply.status == 200) {
            res.status(200).send({external_id: reply.data.msg_id + '-' + reply.data.reply_time})
        } else {
            res.status(reply.status).send(reply.data)
        }
    }).catch(async function(err){
        console.log('error', err.response.status)
        if (err.response.status == 401) {
            let token = await tokped.newToken(process.env.TOKPED_CLIENT_ID, process.env.TOKPED_CLIENT_SECRET);
            metadata['token'] = token.data.access_token;
            let new_reply = await tokped.replyMessagePayload(fsId, req.body, token.data.access_token)
            if (new_reply.status == 200) {
                res.status(200).send({
                    external_id: new_reply.data.msg_id + '-' + new_reply.data.reply_time,
                    metadata: JSON.stringify(metadata)
                })
            } else {
                res.status(new_reply.status).send(new_reply.data)
            }
        } else {
            res.status(err.status).send(err.data)
        }
    })
})

router.post('/file/:filename\.:ext?', function(req, res, next) {
    let fileUrl = req.query.source;
    request.get(fileUrl).pipe(res)
})

router.get('/clickthrough', function(req, res, next) {
	res.status(200).send({});	
})

function doChannelback (body) {

}

module.exports = router;
