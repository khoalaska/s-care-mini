import Apartment from "../models/Apartment.js";

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

