"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("./routes/user.routes");
const complaint_routes_1 = require("./routes/complaint.routes");
const petition_routes_1 = require("./routes/petition.routes");
const migrate_1 = require("./infra/database/migrate");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/', (_req, res) => {
    res.json({ message: 'Voz Urbana API Online' });
});
app.use('/users', user_routes_1.userRoutes);
app.use('/complaints', complaint_routes_1.complaintRoutes);
app.use('/petitions', petition_routes_1.petitionRoutes);
// Global Error Handler
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});
const PORT = process.env.PORT || 3000;
async function bootstrap() {
    await (0, migrate_1.runMigrations)();
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}
bootstrap().catch(console.error);
