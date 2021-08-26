"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const server = () => __awaiter(void 0, void 0, void 0, function* () {
    const PORT = process.env.PORT || 4000;
    try {
        yield db_1.default();
        passport_2.passportStrategies(passport_1.default);
        app_1.default.listen(PORT, () => console.log(`server running on port ${PORT}`));
    }
    catch (error) {
        console.error(error);
        process.exit(0);
    }
});
server();
//# sourceMappingURL=server.js.map