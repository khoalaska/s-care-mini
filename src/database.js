import {Sequelize} from 'sequelize';
import dotenv from  'dotenv';

// gọi hàm này để load các biến môi trường từ file .env vào process.env
dotenv.config();


const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql'
    }

)

async function testConnection() {
    try{
        await sequelize.authenticate();
        console.log('Connection successful.');
       
    } catch(error){
        console.error('Connection failed:', error);
    }
}

testConnection();