
import {createApartment as createApartmentService} from "../services/ApartmentService.js"

export const createApartment = async(req, res) => {

    //lay du lieu tu body
    const {code, floor, area, status} = req.body;

    //goi ham tao 

    const result = await createApartmentService({code, floor, area, status});

    //tra ket qua 

    res.status(201).json(result);


}