require('dotenv').config()
let proxyUrl = process.env.QUOTAGUARDSTATIC_URL;
var url = require("url");

module.exports = {
    protocol: 'http',
    host: url.parse(proxyUrl).hostname,
    port: url.parse(proxyUrl).port,
    auth: {
        username: url.parse(proxyUrl).auth.split(':')[0],
        password: url.parse(proxyUrl).auth.split(':')[1]
    }
};