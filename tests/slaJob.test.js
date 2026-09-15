import { sequelize } from "../src/config/database.js";
import Request from "../src/models/Request.js";
import Notification from "../src/models/Notification.js";
import { checkOverdueRequests } from "../src/jobs/slaJob.js";

describe("SLA Job", () => {
  beforeAll(async () => {
    await sequelize.authenticate();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("should mark overdue request and create notification", async () => {
    const request = await Request.create({
      type: "ELECTRIC",
      description: "Test SLA",
      priority: "HIGH",
      status: "IN_PROGRESS",
      is_overdue: false,
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000),
      due_at: new Date(Date.now() - 60 * 1000),
      created_by: 1,
    });

    await checkOverdueRequests();

    const updatedRequest = await Request.findByPk(request.id);

    const notification = await Notification.findOne({
      where: {
        request_id: request.id,
      },
    });

    expect(updatedRequest.is_overdue).toBe(true);
    expect(notification).not.toBeNull();

    await Notification.destroy({
      where: {
        request_id: request.id,
      },
    });

    await Request.destroy({
      where: {
        id: request.id,
      },
    });
  });

  test("should not create duplicate notification", async () => {
    const request = await Request.create({
      type: "WATER",
      description: "Test duplicate notification",
      priority: "HIGH",
      status: "IN_PROGRESS",
      is_overdue: false,
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000),
      due_at: new Date(Date.now() - 60 * 1000),
      created_by: 1,
    });

    await checkOverdueRequests();

    await checkOverdueRequests();

    const notifications = await Notification.findAll({
      where: {
        request_id: request.id,
      },
    });

    expect(notifications).toHaveLength(1);

    await Notification.destroy({
      where: {
        request_id: request.id,
      },
    });

    await Request.destroy({
      where: {
        id: request.id,
      },
    });
  });
});
