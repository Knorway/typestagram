"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENT_URL = void 0;
exports.CLIENT_URL = process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL
    : 'http://localhost:3000';
//# sourceMappingURL=url.js.map