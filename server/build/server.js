"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("./config/passport");
dotenv_1.default.config();
const server = () => {
    const PORT = process.env.PORT || 4000;
    try {
        db_1.default();
        passport_2.passportStrategies(passport_1.default);
        app_1.default.listen(PORT, () => console.log(`server running on port ${PORT}`));
    }
    catch (error) {
        console.error(error);
        process.exit(0);
    }
};
server();
//# sourceMappingURL=server.js.map