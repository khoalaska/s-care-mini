import { getRequestReport as getRequestReportService } from "../services/ReportService.js";

export const getRequestReport = async (req, res, next) => {
  try {
    const { from, to } = req.query;

    const result = await getRequestReportService({ from, to });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
