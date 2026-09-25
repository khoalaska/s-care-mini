const fs = require('fs');
let code = fs.readFileSync('src/controllers/RequestController.js', 'utf8');
code = code.replace(
  /assignRequest as assignRequestService,[\r\n]+} from "\.\.\/services\/RequestService\.js";/,
  'assignRequest as assignRequestService,\n  getRequestById as getRequestByIdService,\n} from "../services/RequestService.js";'
);
fs.writeFileSync('src/controllers/RequestController.js', code, 'utf8');
