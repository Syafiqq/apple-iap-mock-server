const general = (isError = true, code = 0, message = 'Unknown error occured') => {
    return {
        error: isError,
        error_code: code,
        error_msg: message,
    }
}

const errorWithMessage = (message = 'Unknown error occured') => general(true, 0, message)
const successWithMessage = (message = 'Success') => general(false, 0, message)

module.exports = {
    general,
    errorWithMessage,
    successWithMessage
}