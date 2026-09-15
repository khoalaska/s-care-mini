import { checkOverdueRequests } from "./slaJob.js";

const runSLAJob = async () => {
  try {
    await checkOverdueRequests();
  } catch (error) {
    console.error("[SLA JOB ERROR", error);
  }
};

runSLAJob();

setInterval(runSLAJob, 60 * 1000);
