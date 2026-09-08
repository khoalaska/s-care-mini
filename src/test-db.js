import {sequelize} from "./database.js";

async function testConnection() {
    try{
        await sequelize.authenticate();
        console.log('Connection successful.');
    }catch(error){
        console.error('Connection failed:', error);
    }
}

testConnection();
