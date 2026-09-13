import Apartment from "../models/Apartment.js";
import { Op } from "sequelize";
import User from "../models/User.js";

 export const createApartment = async ({code, floor, area, status}) => {
    // kiem tra nhap input
    if (!code || floor === undefined || area === undefined || !status) {
    throw new Error("Vui lòng nhập đầy đủ thông tin");
    }

     
    const apartmentCodeRegex = /^[A-Z][0-9]{3,4}$/;
    // validate code can hộ
    if (!apartmentCodeRegex.test(code)) {
        throw new Error("Mã căn hộ không hợp lệ");
    }

    
    const apartment = await Apartment.findOne({
        where: {
            code: code
        }
    });
    // kiểm tra căn hộ tồn tại
    if (apartment) {
        throw new Error("Căn hộ đã tồn tại");
    }

    // kiểm tra floor có phải là số nguyên lon hon 0 không
    if (!Number.isInteger(floor) || floor <= 0) {
        throw new Error("Tầng phải là số nguyên lớn hơn 0")
    }

    // kiểm tra area phải là số lớn hơn 0
    if (typeof area !== "number" || area <= 0) {
        throw new Error("Diện tích phải là số lớn hơn 0");
    }

    //tạo căn hộ
    const newApartment = await Apartment.create({
        code,
        floor,
        area,
        status

    });

    return{
        message: "Tạo căn hộ thành công",
        apartment: newApartment
    };
};

export const getApartments = async ({page, limit}) => {
    //gia tri mac dinh
    page = page || 1;
    limit = limit || 10;

    //gioi han limit
    if (limit > 100) {
    throw new Error("Limit không được vượt quá 100");
    }

    //validate page va limit

    page = Number(page);
    limit = Number(limit);
    if (!Number.isInteger(limit) || limit <= 0){
        throw new Error("Limit phải là số nguyên lớn hơn 0");
    }

    if (!Number.isInteger(page) || page <= 0){
        throw new Error("Page phải là số nguyên lớn hơn 0");
    }


    //tinh offset
    const offset = (page - 1) * limit;

    //lay danh sach apartment va tong so apartment
    const {rows, count} = await Apartment.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [["id", "ASC"]]
    });

    // tra ket qua
    return {
        apartments: rows,
        pagination:{
            page: page,
            limit: limit,
            total: count,
            totalPages: Math.ceil(count/ limit)
        }
    };
};

export const updateApartment = async (id, data) => {
    
    const apartment = await Apartment.findByPk(id);

    // kiem tra apartment cua id co ton tai khong
    if(!apartment){
        throw new Error("Căn hộ này không tồn tại!");
    }

    // kiem tra nhap input
    const { code, floor, area, status } = data;

    if (
        code === undefined &&
        floor === undefined &&
        area === undefined &&
        status === undefined
    ) {
        throw new Error("Không có dữ liệu để cập nhật");
    }

    if (code !== undefined){
        const apartmentCodeRegex = /^[A-Z][0-9]{3,4}$/;
        // validate code can hộ
        if (!apartmentCodeRegex.test(code)) {
        throw new Error("Mã căn hộ không hợp lệ");
    }
    }

    if (floor !== undefined){
        // kiểm tra floor có phải là số nguyên lon hon 0 không
    if (!Number.isInteger(floor) || floor <= 0) {
        throw new Error("Tầng phải là số nguyên lớn hơn 0")
        }
    }

    if (area !== undefined){
         // kiểm tra area phải là số lớn hơn 0
        if (typeof area !== "number" || area <= 0) {
        throw new Error("Diện tích phải là số lớn hơn 0");
        }
    }

    if (status !== undefined) {
        if (typeof status !== "string" || status.trim() === "") {
            throw new Error("Trạng thái không hợp lệ");
        }
    }

    if (code !== undefined){
        const duplicateApartment = await Apartment.findOne(
            {
                where: {
                    code: code,
                    id : {
                        [Op.ne]: id
                    }
                }
            }

        );
        if (duplicateApartment) {
            throw new Error("Mã căn hộ đã tồn tại");
        }
    };

    //cap nhat 
    const updateData = {};

    if (code !== undefined) {
        updateData.code = code;
    }

    if (floor !== undefined){
        updateData.floor = floor;
    }

    if (status !== undefined){
        updateData.status = status;
    }

    if (area !== undefined){
        updateData.area = area;
    }

    await apartment.update(updateData);

    // tra ve apartment
    return {
        message: "Cập nhật căn hộ thành công",
        apartment: apartment
    };   
};

export const deleteApartment = async(id) => {
    //Tim apartment theo id
    const apartment = await Apartment.findByPk(id);

    //Neu apartment khong ton tai
    if (!apartment){
        throw new Error("Apartment này không tồn tại !")
    }

    
    const user = await User.findOne({
        where: {
            apartment_id: id
        }
    });

    //Kiem tra apartment co User dang thuoc khong
    if (user){
        throw new Error("Apartment này đang có người ở!")
    }

    //Xóa apartment
    await Apartment.destroy(id);

    return {
        message: "Xóa căn hộ thành công",
    }
}

