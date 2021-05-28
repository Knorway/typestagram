"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imgUpload = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
aws_sdk_1.default.config.update({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    region: 'ap-northeast-2',
});
exports.imgUpload = multer_1.default({
    storage: multer_s3_1.default({
        s3: new aws_sdk_1.default.S3(),
        bucket: 'typestagram',
        key(req, file, callback) {
            var _a;
            callback(null, `${(_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid}/${Date.now()}_${file.originalname}`);
        },
    }),
});
//# sourceMappingURL=multer.js.map