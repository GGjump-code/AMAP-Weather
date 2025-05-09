const axios = require('axios');

class WeatherService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('AMap API key is required');
    }
    this.apiKey = apiKey;
    this.baseUrl = 'https://restapi.amap.com/v3/weather/weatherInfo';
  }

  /**
   * 获取天气信息
   * @param {string} cityAdcode 城市adcode
   * @param {string} [extensions='base'] 气象类型: base(实况天气)或all(预报天气)
   * @returns {Promise<object>}
   */
  async getCurrentWeather(cityAdcode, extensions = 'base') {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          key: this.apiKey,
          city: cityAdcode,
          extensions,
          output: 'JSON'
        }
      });

      if (response.data.status !== '1') {
        throw new Error(`API error: ${response.data.info}`);
      }

      return extensions === 'base' 
        ? this._formatCurrentWeather(response.data)
        : this._formatForecastWeather(response.data);
    } catch (error) {
      throw new Error(`Failed to get weather: ${error.message}`);
    }
  }

  /**
   * 格式化当前天气数据
   * @param {object} data 
   * @returns {object}
   */
  _formatCurrentWeather(data) {
    const weather = data.lives[0];
    return {
      location: {
        name: weather.city,
        province: weather.province,
        adcode: weather.adcode
      },
      weather: {
        description: weather.weather
      },
      temperature: {
        current: weather.temperature,
        unit: '°C'
      },
      wind: {
        direction: weather.winddirection,
        power: weather.windpower
      },
      humidity: weather.humidity,
      reportTime: weather.reporttime,
    };
  }

  /**
   * 格式化天气预报数据
   * @param {object} data 
   * @returns {object}
   */
  _formatForecastWeather(data) {
    const forecast = data.forecasts[0];
    return {
      location: {
        name: forecast.city,
        province: forecast.province,
        adcode: forecast.adcode
      },
      reportTime: forecast.reporttime,
      forecasts: forecast.casts.map(cast => ({
        date: cast.date,
        week: cast.week,
        dayWeather: cast.dayweather,
        nightWeather: cast.nightweather,
        dayTemp: cast.daytemp,
        nightTemp: cast.nighttemp,
        dayWind: cast.daywind,
        nightWind: cast.nightwind,
        dayPower: cast.daypower,
        nightPower: cast.nightpower
      })),
    };
  }

}

module.exports = WeatherService;
