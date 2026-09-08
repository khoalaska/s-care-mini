import {register as registerService} from "../services/AuthService.js";
export const register = async (req, res) => {

    // lay du lieu tu request body
    const { phone_number, password, full_name, apartment_code } = req.body;

    // goi AuthService de xu ly dang ky nguoi dung
    const result = await registerService({ phone_number, password, full_name, apartment_code });
        
    // tra ve ket qua cho client
    res.status(201).json(result);
    
}