import {DataTypes} from 'sequelize';
import {sequelize} from '../config/database.js';

const RequestHistory = sequelize.define('RequestHistory',{
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    updated_by: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        }
    },

    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },

    old_status: {
        type: DataTypes.STRING,
        allowNull: false
    },

    new_status: {
        type: DataTypes.STRING,
        allowNull: false
    },

    note: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    request_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'Request',
            key: 'id'
        }
    }


} ,{tableName: 'RequestHistory'});

export default RequestHistory;