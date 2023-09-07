const axios = require('axios');
const proxyConfig = require("../config/proxy.config");
const replyMessagePayload = function (fsId, msgId, shopId, message, token) {
    const tokpedPayload = {
        method: 'POST',
        url: tokpedReplyUrl(fsId, msgId),
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: {
            shop_id: parseInt(shopId),
            message: message
        },
        proxy: proxyConfig
    }

    return tokpedPayload;
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