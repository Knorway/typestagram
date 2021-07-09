"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const hpp_1 = __importDefault(require("hpp"));
const helmet_1 = __importDefault(require("helmet"));
const errorHandler_1 = require("./middlewares/errorHandler");
// Router
const auth_1 = __importDefault(require("./routes/auth"));
const post_1 = __importDefault(require("./routes/post"));
const user_1 = __importDefault(require("./routes/user"));
const app = express_1.default();
if (process.env.NODE_ENV === 'production') {
    app.use(morgan_1.default('combined'));
    app.use(hpp_1.default());
    app.use(helmet_1.default());
    app.use(cors_1.default({ origin: ['https://typestagram.site'] }));
}
else {
    app.use(morgan_1.default('dev'));
    app.use(cors_1.default({ origin: ['http://localhost:3000'] }));
}
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/auth', auth_1.default);
app.use('/posts', post_1.default);
app.use('/users', user_1.default);
app.use(errorHandler_1.NotFound);
app.use(errorHandler_1.errorHander);
exports.default = app;
//# sourceMappingURL=app.js.map