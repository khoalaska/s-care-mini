import app from "./app.js";
import { sequelize } from "./config/database.js";
import "./models/index.js";
import "./jobs/index.js";
import { connectRedis } from "./config/redis.js";

const PORT = process.env.PORT || 3000;
console.log("1. Starting database sync...");

// đồng bộ các model với cơ sở dữ liệu
await sequelize.sync();
console.log("2. Database sync successful.");

await connectRedis();

console.log("3. Redis connection successful.");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
