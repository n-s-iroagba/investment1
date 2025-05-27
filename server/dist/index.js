import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sequelize from './config/database.js';
import logger from './utils/logger/logger';
import router from './router';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
export const app = express();
const PORT = 3000;
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// const uploadDir = path.join(__dirname, "./uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, 'uploads');
app.use("/uploads", express.static(uploadDir));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'POST, GET,DELETE,PATCH');
    next();
});
app.use((req, res, next) => {
    logger.info(`Request URL: ${req.method} ${req.originalUrl}, ${req.file}`);
    next();
});
app.use('/api', router);
sequelize
    .sync({
// force:true
})
    .then(() => console.log('models formed'))
    .catch((err) => console.log(err));
app.listen(PORT, () => {
    console.log(`takum listening on port ${PORT}`);
});
