import { Op, fn, col, where, literal } from "sequelize";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import Request from "../models/Request.js";
import RequestHistory from "../models/RequestHistory.js";

const isValidDate = (dateString) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(dateString)) {
    return false;
  }

  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

export const getRequestReport = async ({ from, to }) => {
  // object chứa điều kiện lọc ngày
  const dateCondition = {};

  if (from !== undefined || to !== undefined) {
    dateCondition.created_at = {};
    // Nếu có from
    if (from !== undefined) {
      // from có đúng định dạng ngày
      if (!isValidDate(from)) {
        throw new AppError("from không đúng định dạng", 400);
      }

      // Chuyển from thành thời điểm đầu ngày
      const startDate = new Date(`${from}T00:00:00`);
      //Thêm điều kiện created_at >= startDate
      dateCondition.created_at[Op.gte] = startDate;
    }

    //Nếu có "to"
    if (to !== undefined) {
      //to có hợp lệ không
      if (!isValidDate(to)) {
        throw new AppError("to không đúng định dạng", 400);
      }
      // Chuyển to thành ngày kế tiếp
      const endDate = new Date(`${to}T00:00:00`);
      endDate.setDate(endDate.getDate() + 1);
      //Thêm điều kiện created_at < nextDay
      dateCondition.created_at[Op.lt] = endDate;
    }
  }

  //Nếu có cả from và to
  if (from !== undefined && to !== undefined) {
    // kiểm tra from không được lớn hơn to
    if (from > to) {
      throw new AppError(
        "Ngày bắt đầu không được lớn hơn ngày kết thúc !",
        400,
      );
    }
  }

  // 1. Dem so request theo status
  const byStatus = await Request.findAll({
    attributes: ["status", [fn("COUNT", col("Request.id")), "count"]],
    where: dateCondition,
    group: ["status"],
  });

  // 2. Dem so request theo type
  const byType = await Request.findAll({
    attributes: ["type", [fn("COUNT", col("Request.id")), "count"]],
    where: dateCondition,
    group: ["type"],
  });

  const avgProcessingTimeByType = await Request.findAll({
    attributes: [
      "type",
      [
        fn(
          "AVG",
          literal(
            `TIMESTAMPDIFF(SECOND, Request.created_at, histories.created_at)/3600`,
          ),
        ),
        "average_hours",
      ],
    ],
    where: dateCondition,

    include: [
      {
        model: RequestHistory,
        as: "histories",

        where: {
          old_status: "IN_PROGRESS",
          new_status: "DONE",
        },

        attributes: [],
      },
    ],

    group: ["type"],
    raw: true,
  });

  return {
    byStatus,
    byType,
    avgProcessingTimeByType,
  };
};
