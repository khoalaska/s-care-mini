import Request from "../models/Request.js";
import { Op } from "sequelize";
import RequestImage from "../models/RequestImage.js";
import User from "../models/User.js";

export const createRequest = async (
    {
        type,
        description,
        priority,
        created_by
    }
) =>{
    //validate du lieu bat buoc
    if (!type || !description || !priority || !created_by){
        throw new Error("Vui lòng nhập đầy đủ thông tin");
    }

    
    const allowedTypes = [
        "ELECTRIC" ,
        "WATER",
        "CLEANING",
        "SECURITY",
        "OTHER"
    ];
    //validate type
    if (!allowedTypes.includes(type)){
        throw new Error("Loại yêu cầu không hợp lệ");
    }
    const allowedPriorities = [
        "LOW",
        "MEDIUM",
        "HIGH"
    ]

    //validate mức độ ưu tiên
    if(!allowedPriorities.includes(priority)){
        throw new Error("Mức độ ưu tiên không hợp lệ");
    }

    const createdAt = new Date();

    let dueAt;

    if (priority === "HIGH") {
        dueAt = new Date(createdAt.getTime() + 4 * 60 * 60 * 1000);
    }

    if (priority === "MEDIUM") {
        dueAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
    }

    if (priority === "LOW") {
        dueAt = new Date(createdAt.getTime() + 72 * 60 * 60 * 1000);
    }

    const request = await Request.create({
        type,
        description,
        priority,
        status: "NEW",
        is_overdue: false,
        created_at: createdAt,
        due_at: dueAt,
        created_by
    });

    return {
        message: "Tạo yêu cầu thành công",
        request
    };

}

export const getRequests = async ({
    page,
    limit,
    userId,
    role,
    status,
    type,
    priority,
    search,
    from_date,
    to_date
}) => {
     //gia tri mac dinh
    page = page || 1;
    limit = limit || 10;

    page = Number(page);
    limit = Number(limit);

    //page la so nguyen >0
    if(!Number.isInteger(page) || page <= 0){
        throw new Error("page phải là số nguyên > 0");

    }

    //limit la so nguyen > 0
    if(!Number.isInteger(limit) || limit <= 0 || limit > 100){
        throw new Error("limit phải là số nguyên > 0 và không vượt quá 100");
    }

    //tinh offset
    const offset = (page - 1) * limit;

    //gán điều kiện
    const where = {};

    if (role === "RESIDENT"){
        where.created_by = userId;
    }

    if (role === "TECHNICIAN"){
        where.assigned_to = userId;
    }

    if(status !== undefined) {
        where.status = status;
    }

    if(type !== undefined) {
        where.type = type;
    }

    if(priority !== undefined) {
        where.priority = priority;
    }

    if(search !== undefined){
        where.description = {
            [Op.like] : `%${search}%`
        };
    }

    if (from_date !== undefined || to_date !== undefined){

        where.created_at = {};

        if(from_date !== undefined){
            const startDate = new Date(`${from_date}T00:00:00`);
            where.created_at[Op.gte]= startDate;
            
        }

        if(to_date !== undefined){
            const endDate = new Date(`${to_date}T00:00:00`);
            endDate.setDate(endDate.getDate() + 1);
            where.created_at[Op.lt]= endDate;
            
        }
    }

  


    const { rows, count } = await Request.findAndCountAll({
        limit,
        offset,
        where,
        order: [["id", "ASC"]]
    });

    return {
        requests: rows,
        pagination: {
            page,
            limit,
            total: count,
            totalPages: Math.ceil(count / limit)
        }
    };


}

export const uploadImages = async (
    requestId,
    userId,
    files
) => {
   
    const request = await Request.findOne({
        where : {
            id : requestId
        }
    });

     // kiem tra request co ton tai khong
     if (!request) {
        throw new Error("Request này không tồn tại !");
     }
    
    // kiem tra request co thuoc ve resident hiện tại không
    if (request.created_by !== userId) {
        throw new Error("Request này không thuộc về bạn !");
    }

    // số ảnh hiện tại của request
    const imagesCurrent = await RequestImage.count({
        where : {
            request_id : requestId
        }
        
    });

    files = files || [];

    if (files.length === 0) {
        throw new Error("Cần thêm ảnh")
    }

    const imagesAll = imagesCurrent + files.length;

    if (imagesAll > 3) {
        throw new Error("Tổng số ảnh không được quá 3 !");
    }

    const imageData = files.map((file) => {
        return {
            request_id : requestId,
            image_url : `/uploads/${file.filename}`

        };
    });
     const images = await RequestImage.bulkCreate(imageData);

     return {
        images
     }


} 
