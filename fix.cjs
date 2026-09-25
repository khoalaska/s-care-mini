const fs = require('fs');
let code = fs.readFileSync('src/routes/RequestRoutes.js', 'utf8');
code = code.replace(
  'assignRequest,\r\n} from "../controllers/RequestController.js";',
  'assignRequest,\r\n  getRequestById,\r\n} from "../controllers/RequestController.js";'
);
code = code.replace(
  'assignRequest,\n} from "../controllers/RequestController.js";',
  'assignRequest,\n  getRequestById,\n} from "../controllers/RequestController.js";'
);
fs.writeFileSync('src/routes/RequestRoutes.js', code, 'utf8');
