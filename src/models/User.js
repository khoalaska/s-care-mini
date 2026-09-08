import { DataTypes} from 'sequelize';
import {sequelize} from '../database.js';

const User = sequelize.define('User', 
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        full_name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Role',
                key: 'id'
            }
        },

        apartment_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Apartment',
                key: 'id'
            }
        }
    },
    {
        tableName: 'User'
    }
    );

export default User;