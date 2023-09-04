var express = require('express');
const axios = require('axios');
const service = require('../payload/tokopedia')
var router = express.Router();

var tokpedHost = '';

/* GET home page. */
router.post('/chat', function(req, res, next) {
    console.log(JSON.stringify(req.body))
    // axios(service.pushConversationPayload(ZD_PUSH_API, authToken, instance_push_id, external_resource_array))
    //     .then((response) => {
    //     res.status(200).send(response.data)
    //     }, (error) => {
    //     // console.log(error)
    //     goLogging(`cif-unitel-${customer.id}`, 'error', 'PUSH-MANY', customer.id, error, customer.username, `${req.body.instance_id}/${authToken}`);
    //     res.status(error.response.status).send({error: error})
    //     })
    res.status(200).send(req.body)
});

module.exports = router;
