"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const firebase_functions_1 = require("firebase-functions");
(0, firebase_functions_1.setGlobalOptions)({ maxInstances: 10 });
const functions = __importStar(require("firebase-functions"));
const express_1 = __importDefault(require("express"));
const nocache_1 = __importDefault(require("nocache"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = require("./config/cors");
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
app.use((0, nocache_1.default)());
app.use((0, compression_1.default)());
app.use(cors_1.corsMiddleware);
app.use(express_1.default.json({ limit: '1gb' }));
app.use(express_1.default.urlencoded({
    extended: true,
    inflate: true,
    limit: '1mb',
    parameterLimit: 5000,
    type: 'application/x-www-form-urlencoded',
}));
app.use('/api', taskRoutes_1.default);
app.use('/api', userRoutes_1.default);
app.get('/', function (req, res) {
    res.send('Sistema de gestión de Tareas por Usuario');
});
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada',
    });
});
app.use((error, req, res, next) => {
    res.status(500).json({
        success: false,
        error: 'Error',
        message: error.message,
    });
});
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map