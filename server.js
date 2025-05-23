const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Kết nối DB
connectDB();

// Routes
const routes = require('./src/routes/index');

routes(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
