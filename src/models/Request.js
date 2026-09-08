import {DataTypes} from 'sequelize';
import {sequelize} from '../config/database.js';

const Request = sequelize.define('Request',
    {
        id: {   
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },

        type: {
            type: DataTypes.STRING,
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        priority: {
            type: DataTypes.STRING,
            allowNull: false
        },

        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'NEW'   
        },
        
        is_overdue: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },

        created_by: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        },

        assigned_to: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'User',
                key: 'id'
            }
        },

        due_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },{tableName: 'Request'});

export default Request;