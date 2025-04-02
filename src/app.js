const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cacheMiddleware = require('./middleware/cacheMiddleware');
const errorHandler = require('./middleware/errorHandler');
const { client: cacheClient } = require('./config/cache');
const { db } = require('./config/database');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cacheMiddleware);

app.use('/users', userRoutes);
app.use('/products', productRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on('SIGINT', () => {
  cacheClient.quit();
  db.close();
  process.exit();
});
