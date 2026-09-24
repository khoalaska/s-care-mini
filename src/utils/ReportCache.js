import redisClient from "../config/redis.js";

export const invalidateRequestReportCache = async () => {
  const keys = await redisClient.keys("reports:requests:*");

  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};
