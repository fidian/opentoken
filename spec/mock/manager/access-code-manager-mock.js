"use strict";

var OtDateMock, promiseMock;

OtDateMock = require("../ot-date-mock")();
promiseMock = require("../promise-mock")();

module.exports = () => {
    var mock;

    mock = jasmine.createSpyObj("accessCodeManagerMock", [
        "createAsync",
        "deleteAsync",
        "getAsync"
    ]);
    mock.createAsync.andCallFake(() => {
        return promiseMock.resolve({
            code: "access code",
            expires: OtDateMock.fromString("2010-01-23T02:30:00Z"),
            secret: "access code secret"
        });
    });
    mock.deleteAsync.andCallFake(() => {
        return promiseMock.resolve();
    });
    mock.getAsync.andCallFake(() => {
        return promiseMock.resolve({
            description: "This is a fake access code for tests",
            secret: "Secret key"
        });
    });

    return mock;
};
