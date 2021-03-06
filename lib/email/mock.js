"use strict";

/**
 * @param {opentoken~promise} promise
 * @return {opentoken~email}
 */
module.exports = (promise) => {
    return {
        sendAsync: jasmine.createSpy("sendAsync").andReturn(promise.resolve())
    };
};
