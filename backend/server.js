import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import routeRoutes from './routes/route.js'; // Importa le route esterne

// Configurazione per __dirname in moduli ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Configura strictQuery per evitare l'avviso di deprecazione
mongoose.set('strictQuery', false);

// Connessione a MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/tourist-route';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Utilizza le route importate
app.use('/api', routeRoutes);

// Avvio del server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server in esecuzione su http://0.0.0.0:${PORT}`);
});
