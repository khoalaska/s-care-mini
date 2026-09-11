import {register as registerService} from "../services/AuthService.js";
import {login as loginService} from "../services/AuthService.js";
import {createTechnician as createTechnicianService } from "../services/AuthService.js";

export const register = async (req, res) => {

    // lay du lieu tu request body
    const { phone_number, password, full_name, apartment_code } = req.body;

    // goi AuthService de xu ly dang ky nguoi dung
    const result = await registerService({ phone_number, password, full_name, apartment_code });
        
    // tra ve ket qua cho client
    res.status(201).json(result);
    
}

export const login = async (req, res) => {
    // lay du lieu tu request body
    const { phone_number, password } = req.body;

    // goi AuthService de xu ly dang nhap nguoi dung
    const result = await loginService({ phone_number, password });

    // tra ve ket qua cho client
    res.status(200).json(result);
}

export const createTechnician = async (req, res) => {

    // lay du lieu tu request body
    const { phone_number, password, full_name} = req.body;

    // goi AuthService de xu ly dang ky nguoi dung
    const result = await createTechnicianService({ phone_number, password, full_name});
        
    // tra ve ket qua cho client
    res.status(201).json(result);
}