import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { generateWorksheetRoute } from './routes/generateWorksheet.js';
import { generateObjectivesRoute } from './routes/generateObjectives.js';
import { chatRoute } from './routes/chat.js';
import { worksheetChatRoute } from './routes/worksheetChat.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:3000' }));
app.use(express.json());

app.post('/api/generateWorksheet', generateWorksheetRoute);
app.post('/api/generateObjectives', generateObjectivesRoute);
app.post('/api/chat', chatRoute);
app.post('/api/worksheetChat', worksheetChatRoute);
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
