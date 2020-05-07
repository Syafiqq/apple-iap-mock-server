const ellipse = (input, length = 30) => input.length > length ? `${input.substring(0, length)}...` : input;

module.exports = {
    ellipse,
}