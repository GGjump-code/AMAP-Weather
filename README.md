# MCP Weather Service

基于高德地图(AMap) API的天气数据服务，提供RESTful API接口获取中国天气数据。

## 功能特性

- 获取当前天气数据
- 获取天气预报数据
- 支持通过城市adcode查询
- 详细的天气信息返回格式

## 快速开始

### 环境要求

- Node.js 16+
- 高德地图(AMap) API Key

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建`.env`文件并设置高德地图(AMap) API Key:

```env
AMAP_API_KEY=your_api_key_here
```

### 启动服务

开发模式(使用nodemon自动重启):

```bash
npm run dev
```

生产模式:

```bash
npm start
```

服务默认运行在`http://localhost:3000`

## API文档

### 获取天气数据

**请求方式**: POST `/api/weather/current`

**请求参数(JSON)**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| cityAdcode | string | 是 | 城市adcode(高德地图城市编码) |
| forecast | boolean | 否 | 是否获取预报数据(默认false) |

**响应示例(当前天气)**:

```json
{
  "location":
  {
    "name":"北京市","province":"北京","adcode":"110000"
  },
  "weather":{
    "description":"小雨"
  },
  "temperature":{
    "current":"11","unit":"°C"
  },
  "wind":{
    "direction":"东北","power":"≤3"
  },
  "humidity":"100",
  "reportTime":"2025-05-09 14:02:43",
} 
```

**响应示例(预报天气)**:

```json
{
  "location":{
    "name":"北京市",
    "province":"北京",
    "adcode":"110000"
  },
  "reportTime":"2025-05-09 14:02:43",
  "forecasts":[
    {
      "date":"2025-05-09","week":"5","dayWeather":"中雨","nightWeather":"小雨","dayTemp":"13","nightTemp":"10","dayWind":"北","nightWind":"北","dayPower":"1-3","nightPower":"1-3"},
    {
      "date":"2025-05-10","week":"6","dayWeather":"晴","nightWeather":"晴","dayTemp":"23","nightTemp":"12","dayWind":"北","nightWind":"北","dayPower":"1-3","nightPower":"1-3"},
    {
      "date":"2025-05-11","week":"7","dayWeather":"晴","nightWeather":"多云","dayTemp":"25","nightTemp":"15","dayWind":"南","nightWind":"南","dayPower":"1-3","nightPower":"1-3"},
    {
      "date":"2025-05-12","week":"1","dayWeather":"多云","nightWeather":"晴","dayTemp":"27","nightTemp":"17","dayWind":"南","nightWind":"南","dayPower":"1-3","nightPower":"1-3"
    }
  ]
}  
```

## 开发

### MCP配置

```json
{
  "mcpServers": {
    "weather": {
      "disabled": false,
      "timeout": 60,
      "command": "npx",
      "args": [
        "-y",
        "link:/Users/tc/Documents/GitHub/mcp-weather"
      ],
      "transportType": "http",
      "port": 3000,
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

### 项目结构

- `index.js` - 主服务文件，定义API路由
- `weatherService.js` - 天气服务核心逻辑
- `.env` - 环境变量配置
- `package.json` - 项目配置和依赖

### 依赖项

- express - Web框架
- axios - HTTP客户端
- dotenv - 环境变量管理
- express-validator - 请求参数验证

## 贡献

欢迎提交Pull Request或Issue报告问题。

## 许可证

ISC
