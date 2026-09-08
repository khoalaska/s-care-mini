import {DataTypes} from 'sequelize';
import {sequelize} from '../database.js';

const Apartment = sequelize.define('Apartment',
    {
        id: {       
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        floor: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        area: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },{tableName: 'Apartment'});

export default Apartment;