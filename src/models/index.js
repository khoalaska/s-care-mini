import Role from './Role.js';
import User from './User.js';
import Apartment from  './Apartment.js';
import Request from './Request.js';
import RequestImage from './RequestImage.js';
import Notification from './Notification.js';
import RequestHistory from './RequestHistory.js';


Role.hasMany(User, { 
    foreignKey: 'role_id',
    as: 'users'
});
User.belongsTo(Role, { 
    foreignKey: 'role_id',
    as: 'role'
});

User.belongsTo(Apartment, {
    foreignKey: 'apartment_id',
    as: 'apartment'
});

Apartment.hasMany(User, {
    foreignKey: 'apartment_id',
    as: 'users'
});

User.hasMany(Request, {
    foreignKey: 'created_by',
    as: 'createdRequests'
});

Request.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'creator'
});

User.hasMany(Request, {
    foreignKey: 'assigned_to',
    as: 'assignedRequests'
});

Request.belongsTo(User, {
    foreignKey: 'assigned_to',
    as: 'assignee'
});

Request.hasMany(RequestImage, {
    foreignKey: 'request_id',
    as: 'images'
});

RequestImage.belongsTo(Request, {
    foreignKey: 'request_id',
    as: 'request'
});

Request.hasMany(RequestHistory, {
    foreignKey: 'request_id',
    as: 'histories'
});

RequestHistory.belongsTo(Request, {
    foreignKey: 'request_id',
    as: 'request'
});

RequestHistory.belongsTo(User, {
    foreignKey: 'updated_by',
    as: 'updatedBy'
});

User.hasMany(RequestHistory, {
    foreignKey: 'updated_by',
    as: 'requestHistories'
});

Request.hasOne(Notification, {
    foreignKey: 'request_id',
    as: 'notification'
});

Notification.belongsTo(Request, {
    foreignKey: 'request_id',
    as: 'request'
});





