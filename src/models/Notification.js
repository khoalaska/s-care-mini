import {DataTypes} from 'sequelize';
import {sequelize} from '../database.js';

const Notification = sequelize.define('Notification',
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        }, 
        
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },

        request_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: true,
            references: {
                model: 'Request',
                key: 'id'
            }
        }
    },{tableName: 'Notification'});

export default Notification;