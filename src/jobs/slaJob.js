import { Op } from "sequelize";
import Request from "../models/Request.js";
import Notification from "../models/Notification.js";

export const checkOverdueRequests = async () => {
  const now = new Date();

  const requests = await Request.findAll({
    where: {
      due_at: {
        [Op.lt]: now,
      },

      is_overdue: false,
      status: {
        [Op.notIn]: ["DONE", "CLOSED", "REJECTED", "CANCELLED"],
      },
    },
  });

  for (const request of requests) {
    await Request.update(
      {
        is_overdue: true,
      },
      {
        where: {
          id: request.id,
          is_overdue: false,
        },
      },
    );

    await Notification.findOrCreate({
      where: {
        request_id: request.id,
      },
      defaults: {
        request_id: request.id,
      },
    });
  }

  console.log(`[SLA] Checked ${requests.length} overdue requests`);
};
