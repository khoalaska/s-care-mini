import { sequelize } from "../src/config/database.js";
import Request from "../src/models/Request.js";
import RequestHistory from "../src/models/RequestHistory.js";
import User from "../src/models/User.js";
import Role from "../src/models/Role.js";

import { assignRequest } from "../src/services/RequestService.js";

describe("Concurrent Request Assignment", () => {
  let managerRole;
  let technicianRole;
  let residentRole;

  let manager1;
  let manager2;

  let technician1;
  let technician2;

  let resident;
  let request;

  beforeAll(async () => {
    await sequelize.authenticate();

    // Lấy role
    managerRole = await Role.findOne({
      where: { name: "MANAGER" },
    });

    technicianRole = await Role.findOne({
      where: { name: "TECHNICIAN" },
    });

    residentRole = await Role.findOne({
      where: { name: "RESIDENT" },
    });

    expect(managerRole).not.toBeNull();
    expect(technicianRole).not.toBeNull();
    expect(residentRole).not.toBeNull();

    // Lấy 2 technician từ seed
    const technicians = await User.findAll({
      where: {
        role_id: technicianRole.id,
      },
      limit: 2,
      order: [["id", "ASC"]],
    });

    expect(technicians).toHaveLength(2);

    technician1 = technicians[0];
    technician2 = technicians[1];

    // Lấy 1 manager từ seed
    manager1 = await User.findOne({
      where: {
        role_id: managerRole.id,
      },
      order: [["id", "ASC"]],
    });

    expect(manager1).not.toBeNull();

    // Tạo manager thứ 2 để mô phỏng 2 manager thao tác đồng thời
    manager2 = await User.create({
      phone_number: `099999${Date.now()}`,
      password: "test123",
      full_name: "Test Manager 2",
      role_id: managerRole.id,
      apartment_id: null,
    });

    // Lấy resident làm người tạo request
    resident = await User.findOne({
      where: {
        role_id: residentRole.id,
      },
      order: [["id", "ASC"]],
    });

    expect(resident).not.toBeNull();

    // Tạo request ở trạng thái NEW
    request = await Request.create({
      type: "ELECTRIC",
      description: "Concurrency assignment test",
      priority: "HIGH",
      status: "NEW",
      is_overdue: false,
      created_by: resident.id,
      due_at: new Date(Date.now() + 4 * 60 * 60 * 1000),
    });
  });

  afterAll(async () => {
    // Xóa history trước vì history có FK tới Request
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

    // Xóa manager test
    if (manager2) {
      await User.destroy({
        where: {
          id: manager2.id,
        },
      });
    }

    await sequelize.close();
  });

  test("only one manager should successfully assign the same request", async () => {
    const results = await Promise.allSettled([
      assignRequest({
        requestId: request.id,
        technicianId: technician1.id,
        managerId: manager1.id,
      }),

      assignRequest({
        requestId: request.id,
        technicianId: technician2.id,
        managerId: manager2.id,
      }),
    ]);

    // Có đúng 1 request thành công
    const successfulResults = results.filter(
      (result) => result.status === "fulfilled",
    );

    expect(successfulResults).toHaveLength(1);

    // Có đúng 1 request thất bại
    const failedResults = results.filter(
      (result) => result.status === "rejected",
    );

    expect(failedResults).toHaveLength(1);

    // Request thất bại phải là HTTP 409
    expect(failedResults[0].reason.statusCode).toBe(409);

    // Kiểm tra DB sau khi concurrency xảy ra
    const updatedRequest = await Request.findByPk(request.id);

    expect(updatedRequest.status).toBe("ASSIGNED");

    // Chỉ một trong hai technician được assign
    expect([Number(technician1.id), Number(technician2.id)]).toContain(
      Number(updatedRequest.assigned_to),
    );
  });
});
