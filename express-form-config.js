const express = require('express');
const formData = require('express-form-data');
const os = require('os');

const configure = (app) => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    const options = {
        uploadDir: os.tmpdir(),
        autoClean: true
    };
    app.use(formData.parse(options));
    app.use(formData.format());
    app.use(formData.stream());
    app.use(formData.union());
}

module.exports = {
    configure
}