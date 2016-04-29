"use strict";
/**
 * The configuration object for hashing sets up a personal
 * way of hashing data. Each parameter is optional,
 * but highly recommended.
 *
 * @typedef {Object} secureHash~config
 * @property {string} algo the algorithm to use in the digest
 * @property {string} hashLength how long the hashed string will be
 * @property {string} iterations
 * @property {string} salt should be rather lengthy
 */

/**
 * Handles the hashing of data in a secure fashion for use
 * where needed.
 */
module.exports = function (base64, crypto, promise) {
    crypto.pbkdf2Async = promise.promisify(crypto.pbkdf2);

    /**
     * Hashes the content passed using defaults or
     * configuration options if passed in.
     *
     * @param {(Buffer|string)} data
     * @param {secureHash~config} [config]
     * @return {Promise.<string>}
     */
    function secureHashAsync(data, config) {
        var algorithm, hashLength, iterations, salt;

        if (! data) {
            throw new Error("Nothing to hash");
        }

        if (typeof data === "string") {
            data = new Buffer(data, "binary");
        }

        config = config || {};
        algorithm = config.algo || "sha512";
        hashLength = config.hashLength || 48;
        iterations = config.iterations || 10000;
        salt = new Buffer(config.salt || "", "binary");

        return crypto.pbkdf2Async(data, salt, iterations, hashLength, algorithm).then((result) => {
            return base64.encodeForUri(result);
        });
    }

    return {
        hashAsync: secureHashAsync
    };
};