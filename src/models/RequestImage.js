import {DataTypes} from 'sequelize';
import {sequelize} from '../config/database.js';

const RequestImage = sequelize.define('RequestImage',
    {
        id: {   
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
        },

        image_url: {
            type: DataTypes.STRING,
            allowNull: false
        },

        request_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'Request',
                key: 'id'
            }
        }

    },{tableName: 'RequestImage'});

export default RequestImage;