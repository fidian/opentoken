#!/usr/bin/env node

"use strict";

var bluebird, config, fs, mustache, path, request, requestAsync;

/**
 * Retrieves the news headlines in a text format.
 *
 * @param {string} uri
 * @param {Array.<string>} skipTitles
 * @param {Object} replacements
 * @return {Promise.<string>}
 */
function fetchNewsAsync(uri, skipTitles) {
    return requestAsync({
        uri
    }).then((response) => {
        var body;

        body = response.body;
        body = body.replace(/<\/title>([\r\n]|.)*?<title>/g, "\n");
        body = body.replace(/([\r\n]|.)*<title>/, "");
        body = body.replace(/<\/title>([\r\n]|.)*/, "");

        return body.trim().split("\n").filter((title) => {
            return skipTitles.indexOf(title) === -1;
        });
    });
}


/**
 * Loads the config JSON and adds .configPath and .now
 *
 * @return {Object} config data
 */
function loadConfig() {
    var configPath, result;

    configPath = path.resolve(__dirname, "../doc/canary/config.json");
    result = require(path.resolve(__dirname, "../doc/canary/config.json"));
    result.configPath = configPath;
    result.configDir = path.dirname(configPath);
    result.now = new Date().toISOString();

    return result;
}


/**
 * Loads the template
 *
 * @param {string} templateFilename
 * @return {Promise.<string>}
 */
function loadTemplateAsync(templateFilename) {
    return fs.readFileAsync(templateFilename).then((data) => {
        return data.toString("binary");
    });
}

bluebird = require("bluebird");
fs = require("fs");
path = require("path");
mustache = require("mustache");
request = require("request");

fs = bluebird.promisifyAll(fs);
requestAsync = bluebird.promisify(request);

config = loadConfig();
bluebird.props({
    news: fetchNewsAsync(config.url, config.skipTitles),
    template: loadTemplateAsync(path.resolve(config.configDir, config.template))
}).then((bits) => {
    config.news = bits.news;
    console.log(mustache.render(bits.template, config));
});
