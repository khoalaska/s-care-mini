import Request from "../models/Request.js";
import { Op } from "sequelize";
import { sequelize } from "../config/database.js";
import RequestImage from "../models/RequestImage.js";
import User from "../models/User.js";
import RequestHistory from "../models/RequestHistory.js";
import Role from "../models/Role.js";
import { AppError } from "../utils/AppError.js";
import { invalidateRequestReportCache } from "../utils/ReportCache.js";
export const transitions = {
  NEW: ["REJECTED", "CANCELLED"],
  ASSIGNED: ["IN_PROGRESS", "REJECTED"],
  IN_PROGRESS: ["DONE"],
  DONE: ["CLOSED"],
  CLOSED: [],
  REJECTED: [],
  CANCELLED: [],
};

export const transitionRoles = {
  "NEW->ASSIGNED": ["MANAGER"],
  "NEW->REJECTED": ["MANAGER"],
  "NEW->CANCELLED": ["RESIDENT"],

  "ASSIGNED->IN_PROGRESS": ["TECHNICIAN"],
  "ASSIGNED->REJECTED": ["MANAGER"],

  "IN_PROGRESS->DONE": ["TECHNICIAN"],

  "DONE->CLOSED": ["RESIDENT"],
};

export const createRequest = async ({
  type,
  description,
  priority,
  created_by,
}) => {
  //validate du lieu bat buoc
  if (!type || !description || !priority || !created_by) {
    throw new AppError("Vui lòng nhập đầy đủ thông tin", 400);
  }

  const allowedTypes = ["ELECTRIC", "WATER", "CLEANING", "SECURITY", "OTHER"];
  //validate type
  if (!allowedTypes.includes(type)) {
    throw new AppError("Loại yêu cầu không hợp lệ", 400);
  }
  const allowedPriorities = ["LOW", "MEDIUM", "HIGH"];

  //validate mức độ ưu tiên
  if (!allowedPriorities.includes(priority)) {
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
    created_by,
  });

  await invalidateRequestReportCache();

  return {
    message: "Tạo yêu cầu thành công",
    request,
  };
};

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
  to_date,
}) => {
  //gia tri mac dinh
  page = page || 1;
  limit = limit || 10;

  page = Number(page);
  limit = Number(limit);

  //page la so nguyen >0
  if (!Number.isInteger(page) || page <= 0) {
    throw new Error("page phải là số nguyên > 0");
  }

  //limit la so nguyen > 0
  if (!Number.isInteger(limit) || limit <= 0 || limit > 100) {
    throw new Error("limit phải là số nguyên > 0 và không vượt quá 100");
  }

  //tinh offset
  const offset = (page - 1) * limit;

  //gán điều kiện
  const where = {};

  if (role === "RESIDENT") {
    where.created_by = userId;
  }

  if (role === "TECHNICIAN") {
    where.assigned_to = userId;
  }

  if (status !== undefined) {
    where.status = status;
  }

  if (type !== undefined) {
    where.type = type;
  }

  if (priority !== undefined) {
    where.priority = priority;
  }

  if (search !== undefined) {
    where.description = {
      [Op.like]: `%${search}%`,
    };
  }

  if (from_date !== undefined || to_date !== undefined) {
    where.created_at = {};

    if (from_date !== undefined) {
      const startDate = new Date(`${from_date}T00:00:00`);
      where.created_at[Op.gte] = startDate;
    }

    if (to_date !== undefined) {
      const endDate = new Date(`${to_date}T00:00:00`);
      endDate.setDate(endDate.getDate() + 1);
      where.created_at[Op.lt] = endDate;
    }
  }

  const { rows, count } = await Request.findAndCountAll({
    limit,
    offset,
    where,
    order: [["id", "ASC"]],
  });

  return {
    requests: rows,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};

export const uploadImages = async (requestId, userId, files) => {
  const request = await Request.findOne({
    where: {
      id: requestId,
    },
  });

  // kiem tra request co ton tai khong
  if (!request) {
    throw new AppError("Request này không tồn tại !", 404);
  }

  // kiem tra request co thuoc ve resident hiện tại không
  if (request.created_by !== userId) {
    throw new AppError("Request này không thuộc về bạn !", 403);
  }

  // số ảnh hiện tại của request
  const imagesCurrent = await RequestImage.count({
    where: {
      request_id: requestId,
    },
  });

  files = files || [];

  if (files.length === 0) {
    throw new AppError("Cần thêm ảnh", 400);
  }

  const imagesAll = imagesCurrent + files.length;

  if (imagesAll > 3) {
    throw new AppError("Tổng số ảnh không được quá 3 !", 400);
  }

  const imageData = files.map((file) => {
    return {
      request_id: requestId,
      image_url: `/uploads/${file.filename}`,
    };
  });
  const images = await RequestImage.bulkCreate(imageData);

  return {
    images,
  };
};

export const updateStatus = async ({
  requestId,
  newStatus,
  userId,
  role,
  note,
}) => {
  const request = await Request.findOne({
    where: {
      id: requestId,
    },
  });

  //kiem tra request ton tai
  if (!request) {
    throw new Error("Yêu cầu này không tồn tại !");
  }

  const statusCurrent = request.status;

  if (!transitions[statusCurrent].includes(newStatus)) {
    throw new AppError("Lỗi chuyển trạng thái !", 409);
  }

  if (!transitionRoles[`${statusCurrent}->${newStatus}`].includes(role)) {
    throw new Error("Bạn không có quyền thay đổi trạng thái này !");
  }

  if (newStatus === "REJECTED" && !note?.trim()) {
    throw new AppError("Bạn cần nhập lí do từ chối !", 400);
  }

  //Kiểm tra ownership / assignment
  if (newStatus === "CANCELLED" || newStatus === "CLOSED") {
    if (request.created_by !== userId) {
      throw new Error("Bạn không phải người tạo yêu cầu này!");
    }
  }

  if (newStatus === "IN_PROGRESS" || newStatus === "DONE") {
    if (request.assigned_to !== userId) {
      throw new Error("Bạn không được gán vào yêu cầu này!");
    }
  }

  //transaction
  const result = await sequelize.transaction(async (transaction) => {
    await request.update(
      {
        status: newStatus,
      },
      {
        transaction,
      },
    );
    const history = await RequestHistory.create(
      {
        request_id: requestId,
        updated_by: userId,
        old_status: statusCurrent,
        new_status: newStatus,
        note: note,
      },
      {
        transaction,
      },
    );

    return {
      message: "Cập nhật trạng thái thành công",
      request,
      history,
    };
  });

  await invalidateRequestReportCache();

  return result;
};

export const assignRequest = async ({ requestId, technicianId, managerId }) => {
  const request = await Request.findOne({
    where: {
      id: requestId,
    },
  });

  // kiem tra request co ton tai khong
  if (!request) {
    throw new AppError("Yêu cầu này không tồn tại !", 404);
  }

  const technician = await User.findByPk(technicianId);

  if (!technician) {
    throw new AppError("Kỹ thuật viên này không tồn tại !", 400);
  }

  const roleObj = await Role.findByPk(technician.role_id);
  if (!roleObj || roleObj.name !== "TECHNICIAN") {
    throw new AppError("Người dùng này không phải là Kỹ thuật viên !", 400);
  }

  const result = await sequelize.transaction(async (transaction) => {
    const [affectedRows] = await Request.update(
      {
        assigned_to: technicianId,
        status: "ASSIGNED",
      },
      {
        where: {
          id: requestId,
          status: "NEW",
          assigned_to: null,
        },
        transaction,
      },
    );

    if (affectedRows === 0) {
      throw new AppError(
        "Yêu cầu đã được phân công hoặc không còn ở trạng thái NEW",
        409,
      );
    }

    await RequestHistory.create(
      {
        request_id: requestId,
        updated_by: managerId,
        old_status: "NEW",
        new_status: "ASSIGNED",
        note: null,
      },
      {
        transaction,
      },
    );

    return {
      message: "Phân công yêu cầu thành công",
    };
  });

  await invalidateRequestReportCache();

  return result;
};

export const getRequestById = async (id, userId, role) => {
  const request = await Request.findOne({
    where: { id },
    include: [
      { model: RequestImage, as: "images" },
      { model: RequestHistory, as: "histories", include: [{ model: User, as: "updatedBy", attributes: ["full_name"] }] },
      { model: User, as: "creator", attributes: ["full_name", "phone_number", "apartment_id"] },
      { model: User, as: "assignee", attributes: ["id", "full_name", "phone_number"] }
    ],
    order: [[{ model: RequestHistory, as: "histories" }, "created_at", "DESC"]]
  });

  if (!request) {
    throw new AppError("Yêu cầu không tồn tại", 404);
  }

  if (role === "RESIDENT" && request.created_by !== userId) {
    throw new AppError("Bạn không có quyền xem yêu cầu này", 403);
  }
  if (role === "TECHNICIAN" && request.assigned_to !== userId) {
    throw new AppError("Bạn không có quyền xem yêu cầu này", 403);
  }

  return request;
};
