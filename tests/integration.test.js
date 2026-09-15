import { sequelize } from "../src/config/database.js";

import Request from "../src/models/Request.js";
import RequestHistory from "../src/models/RequestHistory.js";
import User from "../src/models/User.js";
import Role from "../src/models/Role.js";

import { assignRequest, updateStatus } from "../src/services/RequestService.js";

describe("Request lifecycle integration test", () => {
  let manager;
  let technician;
  let resident;

  let request;

  let managerRole;
  let technicianRole;
  let residentRole;

  beforeAll(async () => {
    await sequelize.authenticate();

    // =========================
    // 1. Lấy các role
    // =========================

    managerRole = await Role.findOne({
      where: {
        name: "MANAGER",
      },
    });

    technicianRole = await Role.findOne({
      where: {
        name: "TECHNICIAN",
      },
    });

    residentRole = await Role.findOne({
      where: {
        name: "RESIDENT",
      },
    });

    expect(managerRole).not.toBeNull();
    expect(technicianRole).not.toBeNull();
    expect(residentRole).not.toBeNull();

    // =========================
    // 2. Lấy user từ seed
    // =========================

    manager = await User.findOne({
      where: {
        role_id: managerRole.id,
      },
    });

    technician = await User.findOne({
      where: {
        role_id: technicianRole.id,
      },
    });

    resident = await User.findOne({
      where: {
        role_id: residentRole.id,
      },
    });

    expect(manager).not.toBeNull();
    expect(technician).not.toBeNull();
    expect(resident).not.toBeNull();

    // =========================
    // 3. Tạo request NEW
    // =========================

    request = await Request.create({
      type: "ELECTRIC",
      description: "Integration test request",
      priority: "HIGH",
      status: "NEW",
      is_overdue: false,
      created_by: resident.id,
      due_at: new Date(Date.now() + 4 * 60 * 60 * 1000),
    });

    expect(request.status).toBe("NEW");
  });

  afterAll(async () => {
    // Xóa history trước
    if (request) {
      await RequestHistory.destroy({
        where: {
          request_id: request.id,
        },
      });

      await Request.destroy({
        where: {
          id: request.id,
        },
      });
    }

    await sequelize.close();
  });

  test("should complete request lifecycle: NEW -> ASSIGNED -> IN_PROGRESS -> DONE -> CLOSED", async () => {
    // ==================================================
    // STEP 1: NEW -> ASSIGNED
    // ==================================================

    await assignRequest({
      requestId: request.id,
      technicianId: technician.id,
      managerId: manager.id,
    });

    let updatedRequest = await Request.findByPk(request.id);

    expect(updatedRequest.status).toBe("ASSIGNED");

    expect(Number(updatedRequest.assigned_to)).toBe(Number(technician.id));

    // ==================================================
    // STEP 2: ASSIGNED -> IN_PROGRESS
    // ==================================================

    await updateStatus({
      requestId: request.id,
      newStatus: "IN_PROGRESS",
      userId: technician.id,
      role: "TECHNICIAN",
    });

    updatedRequest = await Request.findByPk(request.id);

    expect(updatedRequest.status).toBe("IN_PROGRESS");

    // ==================================================
    // STEP 3: IN_PROGRESS -> DONE
    // ==================================================

    await updateStatus({
      requestId: request.id,
      newStatus: "DONE",
      userId: technician.id,
      role: "TECHNICIAN",
    });

    updatedRequest = await Request.findByPk(request.id);

    expect(updatedRequest.status).toBe("DONE");

    // ==================================================
    // STEP 4: DONE -> CLOSED
    // ==================================================

    await updateStatus({
      requestId: request.id,
      newStatus: "CLOSED",
      userId: resident.id,
      role: "RESIDENT",
    });

    updatedRequest = await Request.findByPk(request.id);

    expect(updatedRequest.status).toBe("CLOSED");

    // ==================================================
    // STEP 5: Kiểm tra lịch sử
    // ==================================================

    const histories = await RequestHistory.findAll({
      where: {
        request_id: request.id,
      },
      order: [["id", "ASC"]],
    });

    expect(histories).toHaveLength(4);

    expect(histories[0].old_status).toBe("NEW");
    expect(histories[0].new_status).toBe("ASSIGNED");

    expect(histories[1].old_status).toBe("ASSIGNED");
    expect(histories[1].new_status).toBe("IN_PROGRESS");

    expect(histories[2].old_status).toBe("IN_PROGRESS");
    expect(histories[2].new_status).toBe("DONE");

    expect(histories[3].old_status).toBe("DONE");
    expect(histories[3].new_status).toBe("CLOSED");
  });
});
