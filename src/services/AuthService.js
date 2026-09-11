import User from "../models/User.js";
import bcrypt from "bcrypt";
import Apartment from "../models/Apartment.js";
import Role from "../models/Role.js";
import jwt from "jsonwebtoken";

export const register = async ({ phone_number, password, full_name,apartment_code }) => {

    // validate dữ liệu đầu vào
    if (!phone_number || !password || !full_name || !apartment_code) {
        throw new Error("Vui lòng nhập đầy đủ thông tin");
    }

    // validate code can hộ
    const apartmentCodeRegex = /^[A-Z][0-9]{3,4}$/;
    if (!apartmentCodeRegex.test(apartment_code)) {
        throw new Error("Mã căn hộ không hợp lệ");
    }

     // validate password
    if (password.length < 6) {
        throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
    }

    // validate full name
    const fullNameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (!fullNameRegex.test(full_name)) {
        throw new Error("Họ và tên không hợp lệ");
    }

    // validate format số điện thoại
    const phoneNumberRegex = /^\d{10}$/;
    if (!phoneNumberRegex.test(phone_number)) {
        throw new Error("Số điện thoại không hợp lệ");
    }

    // kiểm tra số điện thoại đã tồn tại
    const existingUser = await User.findOne({
        where: {
            phone_number: phone_number
        }
    });
    if (existingUser) {
        throw new Error("Số điện thoại đã tồn tại");
    }

   

    // kiểm tra căn hộ tồn tại
    const apartment = await Apartment.findOne({
        where: {
            code: apartment_code
        }
    });

    if (!apartment) {
        throw new Error("Căn hộ không tồn tại");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // tạo user
    const user = await User.create({
        phone_number,
        password: hashedPassword,
        full_name,
        apartment_id: apartment.id,
        role_id: (await Role.findOne({where: {name: 'RESIDENT'}})).id
    });



    // trả kết quả
    return {
        message: "Ban đã đăng ký thành công",
    };

   
}

 export const login = async ({ phone_number, password }) => {

        // validate dữ liệu đầu vào
        if (!phone_number || !password) {
            throw new Error("Vui lòng nhập đầy đủ thông tin");
        }
         // validate format số điện thoại
        const phoneNumberRegex = /^\d{10}$/;
        if (!phoneNumberRegex.test(phone_number)) {
        throw new Error("Số điện thoại không hợp lệ");
        }

         // validate password
        if (password.length < 6) {
        throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
        }

        // tìm user theo số điện thoại
        const user = await User.findOne({
            where: {
                phone_number: phone_number
            }
        });

        // kiểm tra số điện thoại tồn tại
        if (!user) {
            throw new Error("Số điện thoại không tồn tại");
        }

        // kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Mật khẩu không đúng");
        }

        // lấy role của user
        const role = await Role.findByPk(user.role_id);

        //kiểm tra role của user
        if (!role) {
            throw new Error("Role không tồn tại");
        }

        // tạo token
        const token = jwt.sign(
            {
                userId: user.id,
                role: role.name
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }        
        );


        // trả kết quả
        return {
            message: "Đăng nhập thành công",
            access_token: token,
        }
    }

    export const createTechnician = async ({ phone_number, password, full_name}) => {

    // validate dữ liệu đầu vào
    if (!phone_number || !password || !full_name) {
        throw new Error("Vui lòng nhập đầy đủ thông tin");
    }

     // validate password
    if (password.length < 6) {
        throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
    }

    // validate full name
    const fullNameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (!fullNameRegex.test(full_name)) {
        throw new Error("Họ và tên không hợp lệ");
    }

    // validate format số điện thoại
    const phoneNumberRegex = /^\d{10}$/;
    if (!phoneNumberRegex.test(phone_number)) {
        throw new Error("Số điện thoại không hợp lệ");
    }

    // kiểm tra số điện thoại đã tồn tại
    const existingUser = await User.findOne({
        where: {
            phone_number: phone_number
        }
    });
    if (existingUser) {
        throw new Error("Số điện thoại đã tồn tại");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // tạo user
    const user = await User.create({
        phone_number,
        password: hashedPassword,
        full_name,
        role_id: (await Role.findOne({where: {name: 'TECHNICIAN'}})).id
    });



    // trả kết quả
    return {
        message: "Ban đã đăng ký thành công",
    };

   
}