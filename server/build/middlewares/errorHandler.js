"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHander = exports.NotFound = void 0;
const NotFound = (req, res, next) => {
    const error = new Error(`존재하지 않는 경로입니다: ${req.originalUrl}`);
    res.status(404);
    next(error);
};
exports.NotFound = NotFound;
const errorHander = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
};
exports.errorHander = errorHander;
//# sourceMappingURL=errorHandler.js.map