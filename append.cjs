const fs = require('fs');
const content = `
export const getRequestById = async (id, userId, role) => {
  const request = await Request.findOne({
    where: { id },
    include: [
      { model: RequestImage, as: "images" },
      { model: RequestHistory, as: "histories", include: [{ model: User, as: "updatedBy", attributes: ["full_name"] }] },
      { model: User, as: "creator", attributes: ["full_name", "phone_number", "apartment_id"] },
      { model: User, as: "assignee", attributes: ["full_name", "phone_number"] }
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
`;
fs.appendFileSync('src/services/RequestService.js', content, 'utf8');
