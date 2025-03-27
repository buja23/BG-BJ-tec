import express, { urlencoded } from 'express';
import __dirname from '../utils/pathUtils.js';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import compression from 'compression';
import ratelimit from 'express-rate-limit';
import morgan from 'morgan';

const staticMiddleware = express.static(path.join(__dirname, 'assets'));

const urlencodedMiddleware = express.urlencoded({ extended: true });
const jsonMiddleware = express.json();

const securityMiddleware = helmet();

const compressionMiddleware = compression();

const ratelimiteMiddleware = ratelimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Você excedeu o limite de requisições, tente novamente em 10 minutos.'
});

const logFile = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' });
const morganMiddleware = morgan('combined', { stream: logFile });

export{
    staticMiddleware,
    urlencodedMiddleware,
    jsonMiddleware,
    securityMiddleware,
    compressionMiddleware,
    ratelimiteMiddleware,
    morganMiddleware
}