import { getRequestReport as getRequestReportService } from "../services/ReportService.js";
import { reportToCsv } from "../services/CsvService.js";
export const getRequestReport = async (req, res, next) => {
  try {
    const { from, to } = req.query;

    const result = await getRequestReportService({ from, to });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const exportRequestReport = async (req, res) => {
  const { from, to } = req.query;

  const report = await getRequestReportService({
    from,
    to,
  });

  const csv = reportToCsv(report);

  const fileName = `request_report_${from || "all"}_${to || "all"}.csv`;

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

  res.send("\uFEFF" + csv);
};
