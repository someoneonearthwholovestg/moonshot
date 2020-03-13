import express from 'express';
import bodyParser from 'body-parser'

const app = express();

// applying middleware
app.use(bodyParser.json())