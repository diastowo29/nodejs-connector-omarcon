const pushConversationPayload = function (instance, cifToken, pushId, extResources) {
    const cifPayload = {
        method: 'POST',
        url: pushEndpoint(instance),
        headers: {
            'Authorization': cifToken
        },
        data: {
            instance_push_id: pushId,
            external_resources: extResources
        }
    }

    return cifPayload;
}

const pushBackPayload = function (replyBackApi, chatToken, messagePayload) {
    const replybackPayload = {
        method: 'POST',
        url: replyBackApi,
        headers: {
            'Authorization': 'Bearer ' + chatToken
        },
        data: {
            message: messagePayload
        }
    }

    return replybackPayload;
}

function pushEndpoint (instance) {
    return `https://${instance}.zendesk.com/api/v2/any_channel/push`
}

module.exports = {
    pushConversationPayload,
    pushBackPayload
}