import User from "../models/User.js";
import bcrypt from "bcrypt";
import Apartment from "../models/Apartment.js";
import Role from "../models/Role.js";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

const generateAccessToken = (userId, role) => {
  return jwt.sign(
    {
      userId,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

export const register = async ({
  phone_number,
  password,
  full_name,
  apartment_code,
}) => {
  // validate dữ liệu đầu vào
  if (!phone_number || !password || !full_name || !apartment_code) {
    throw new AppError("Vui lòng nhập đầy đủ thông tin", 400);
  }

  // validate code can hộ
  const apartmentCodeRegex = /^[A-Z][0-9]{3,4}$/;
  if (!apartmentCodeRegex.test(apartment_code)) {
    throw new AppError("Mã căn hộ không hợp lệ", 400);
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
      phone_number: phone_number,
    },
  });
  if (existingUser) {
    throw new AppError("Số điện thoại đã tồn tại", 409);
  }

  // kiểm tra căn hộ tồn tại
  const apartment = await Apartment.findOne({
    where: {
      code: apartment_code,
    },
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
    role_id: (await Role.findOne({ where: { name: "RESIDENT" } })).id,
  });

  // trả kết quả
  return {
    message: "Ban đã đăng ký thành công",
  };
};

export const login = async ({ phone_number, password }) => {
  // validate dữ liệu đầu vào
  if (!phone_number || !password) {
    throw new AppError("Vui lòng nhập đầy đủ thông tin", 400);
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
      phone_number: phone_number,
    },
  });

  // kiểm tra số điện thoại tồn tại
  if (!user) {
    throw new AppError("Số điện thoại không tồn tại", 401);
  }

  // kiểm tra mật khẩu
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Mật khẩu không đúng", 401);
  }

  // lấy role của user
  const role = await Role.findByPk(user.role_id);

  //kiểm tra role của user
  if (!role) {
    throw new Error("Role không tồn tại");
  }

  // tạo token
  const accessToken = generateAccessToken(user.id, role.name);

  const refreshToken = generateRefreshToken(user.id);

  // trả kết quả
  return {
    message: "Đăng nhập thành công",
    access_token: accessToken,
    refresh_token: refreshToken,
  };
};

export const createTechnician = async ({
  phone_number,
  password,
  full_name,
}) => {
  // validate dữ liệu đầu vào
  if (!phone_number || !password || !full_name) {
    throw new AppError("Vui lòng nhập đầy đủ thông tin", 400);
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
      phone_number: phone_number,
    },
  });
  if (existingUser) {
    throw new AppError("Số điện thoại đã tồn tại", 409);
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // tạo user
  const user = await User.create({
    phone_number,
    password: hashedPassword,
    full_name,
    role_id: (await Role.findOne({ where: { name: "TECHNICIAN" } })).id,
  });

  // trả kết quả
  return {
    user,
    message: "Ban đã đăng ký thành công",
  };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token không được cung cấp", 401);
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new AppError("Refresh token không hợp lệ hoặc đã hết hạn", 401);
  }

  const user = await User.findByPk(decoded.userId);

  if (!user) {
    throw new AppError("Người dùng không tồn tại", 401);
  }

  const role = await Role.findByPk(user.role_id);

  if (!role) {
    throw new AppError("Role không tồn tại", 401);
  }

  const accessToken = generateAccessToken(user.id, role.name);

  return {
    access_token: accessToken,
  };
};
