"use strict";

describe("validateRequestBodyMiddleware", () => {
    var chainMiddlewareMock, ErrorResponse, restifyPluginsMock, tv4Mock, validateRequestBodyMiddleware;

    beforeEach(() => {
        var promiseMock;

        promiseMock = require("../../mock/promise-mock")();
        ErrorResponse = require("../../../lib/error-response")(promiseMock);
        chainMiddlewareMock = jasmine.createSpy("chainMiddlewareMock");
        restifyPluginsMock = jasmine.createSpyObj("restifyPlugins", [
            "bodyParser"
        ]);
        tv4Mock = jasmine.createSpyObj("tv4", [
            "validateResult"
        ]);
        tv4Mock.validateResult.andReturn({
            error: null,
            missing: [],
            valid: "true"
        });
        validateRequestBodyMiddleware = require("../../../lib/middleware/validate-request-body-middleware")(chainMiddlewareMock, ErrorResponse, restifyPluginsMock, tv4Mock);
    });
    it("parses the body", () => {
        validateRequestBodyMiddleware("schema");
        expect(restifyPluginsMock.bodyParser).toHaveBeenCalled();
    });
    describe("validation against schema", () => {
        var middlewareAsync, req, res;

        beforeEach(() => {
            var middleware;

            validateRequestBodyMiddleware("schema");
            middleware = chainMiddlewareMock.mostRecentCall.args[1];
            middlewareAsync = jasmine.middlewareToPromise(middleware);
            req = require("../../mock/request-mock")();
            res = require("../../mock/response-mock")();
        });
        it("calls tv4.validateResult()", () => {
            req.body = {
                body: true
            };

            return middlewareAsync(req, res).then(() => {
                expect(tv4Mock.validateResult).toHaveBeenCalledWith({
                    body: true
                }, "schema");
                expect(res.send).not.toHaveBeenCalled();
            });
        });
        it("errors when the schema does not validateResult", () => {
            req.body = {
                body: true
            };
            tv4Mock.validateResult.andReturn({
                validation: "errors"
            });

            return middlewareAsync(req, res).then(jasmine.fail, () => {
                expect(tv4Mock.validateResult).toHaveBeenCalledWith({
                    body: true
                }, "schema");
                expect(res.send).toHaveBeenCalledWith(400, jasmine.any(ErrorResponse));
            });
        });
    });
});
