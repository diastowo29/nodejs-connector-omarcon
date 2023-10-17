const axios = require('axios');
const proxyConfig = require("../config/proxy.config");
const replyMessagePayload = function (fsId, body, token) {
    let msgId = body.parent_id.split('-')[3];
    let shopId = body.thread_id.split('-')[3];
    const tokpedPayload = {
        method: 'POST',
        url: tokpedReplyUrl(fsId, msgId),
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: {
            shop_id: parseInt(shopId),
            message: body.message
        },
        proxy: proxyConfig
    }
    
    if (body['file_urls[]']) {
        if (!Array.isArray(body['file_urls[]'])) {
            body['file_urls[]'] = [body['file_urls[]']]
        }
        tokpedPayload.data['attachment_type'] = 2
        tokpedPayload.data['file_path'] = body['file_urls[]'][0]
    }
    console.log(JSON.stringify(tokpedPayload))
    // return axios(tokpedPayload);
}

const newToken = function (id, secret) {
    return axios({
        method: 'POST',
        url: 'https://accounts.tokopedia.com/token?grant_type=client_credentials',
        headers: {
            'Authorization': 'Basic ' + new Buffer.from(id + ":" + secret).toString("base64")
        }
    })
}

function tokpedReplyUrl (fsId, msgId) {
    return `https://fs.tokopedia.net/v1/chat/fs/${fsId}/messages/${msgId}/reply`
}

module.exports = {
    replyMessagePayload,
    newToken
}