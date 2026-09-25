const fs = require('fs');

// Modify RequestController.js
let controller = fs.readFileSync('src/controllers/RequestController.js', 'utf8');
controller = controller.replace(
  'assignRequest as assignRequestService,\n} from "../services/RequestService.js";',
  'assignRequest as assignRequestService,\n  getRequestById as getRequestByIdService,\n} from "../services/RequestService.js";'
);
controller += `
export const getRequestById = async (req, res, next) => {
  try {
    const result = await getRequestByIdService(req.params.id, req.user.userId, req.user.role);
    res.status(200).json(result);
  } catch (error) {
    next(error); // Send to error middleware
  }
};
`;
fs.writeFileSync('src/controllers/RequestController.js', controller, 'utf8');

// Modify RequestRoutes.js
let routes = fs.readFileSync('src/routes/RequestRoutes.js', 'utf8');
routes = routes.replace(
  'assignRequest,\n} from "../controllers/RequestController.js";',
  'assignRequest,\n  getRequestById,\n} from "../controllers/RequestController.js";'
);
// Insert GET /:id before patch endpoints
routes = routes.replace(
  'router.patch(',
  'router.get("/:id", authMiddleware, roleMiddleware("MANAGER", "RESIDENT", "TECHNICIAN"), getRequestById);\n\nrouter.patch('
);
fs.writeFileSync('src/routes/RequestRoutes.js', routes, 'utf8');
