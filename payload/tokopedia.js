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
        proxy: {
            protocol: 'http',
            host: 'us-east-static-04.quotaguard.com',
            port: 9293,
            auth: {
                username: 'dwz46euwvq023k',
                password: 'e5cnvi39jeq8nooxxe0hopd78a1xn'
            }
        }
    }

    return tokpedPayload;
}

function tokpedReplyUrl (fsId, msgId) {
    return `https://fs.tokopedia.net/v1/chat/fs/${fsId}/messages/${msgId}/reply`
}

module.exports = {
    replyMessagePayload
}