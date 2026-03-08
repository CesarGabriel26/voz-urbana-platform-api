import "dotenv/config";
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { userRoutes } from './routes/user.routes';
import { complaintRoutes } from './routes/complaint.routes';
import { petitionRoutes } from './routes/petition.routes';
import { tseRoutes } from './routes/tse.routes';
import { runMigrations } from './infra/database/migrate';

const app = express();

app.use(cors({
    origin: '*', // process.env.CORS_ORIGIN ||
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());


app.get('/', (_req: Request, res: Response) => {
    res.json({ message: 'Voz Urbana API Online' });
});

app.use('/users', userRoutes);
app.use('/complaints', complaintRoutes);
app.use('/petitions', petitionRoutes);
app.use('/tse', tseRoutes);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

const PORT = process.env.PORT || 3000;

async function bootstrap() {
    // await runMigrations();
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}

bootstrap().catch(console.error);