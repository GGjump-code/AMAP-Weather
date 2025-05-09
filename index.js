const express = require('express');
const { body, validationResult } = require('express-validator');
const WeatherService = require('./weatherService');
require('dotenv').config();

const app = express();
const weatherService = new WeatherService(process.env.AMAP_API_KEY);

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * @swagger
 * /api/weather/current:
 *   post:
 *     summary: Get weather data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cityAdcode:
 *                 type: string
 *                 description: City adcode (see AMap documentation)
 *               forecast:
 *                 type: boolean
 *                 default: false
 *                 description: Whether to get forecast data (defaults to current weather)
 *     responses:
 *       200:
 *         description: Weather data
 *       400:
 *         description: Invalid input parameters
 *       500:
 *         description: Server error
 */
app.post('/api/weather/current', 
  [
    body('cityAdcode').isString().withMessage('City adcode is required'),
    body('forecast').optional().isBoolean()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const { cityAdcode, forecast = false } = req.body;
    const weather = await weatherService.getCurrentWeather(
      cityAdcode,
      forecast ? 'all' : 'base'
    );
    res.json(weather);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Weather server running on port ${PORT}`);
});
