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