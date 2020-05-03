const _ = require('lodash');

const logRequest = req => {
    console.log({
        'header': _.pick(req.headers, ['api-key', 'uid']),
        'body': req.body
    })
}

module.exports = {
    logRequest
}