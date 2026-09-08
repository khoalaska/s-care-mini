import app from './app.js';
import {sequelize} from './database.js';
import './models/index.js';

const PORT = process.env.PORT || 3000;
console.log("1. Starting database sync...");

// đồng bộ các model với cơ sở dữ liệu
await sequelize.sync({ alter: true });
console.log("2. Database sync successful.");

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
                                    