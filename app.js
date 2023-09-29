require('dotenv').config();
const express = require('express');
const cors = require('cors');
const indexRouter = require('./routes/index');
const statsRouter = require('./routes/stats');
const mutationsRouter = require('./routes/mutations');
const app = express();

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Engines
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', indexRouter);
app.use("/mutations", mutationsRouter);
app.use('/stats', statsRouter);

module.exports = app;
