
import {createApartment as createApartmentService,
        getApartments as getApartmentsService,
        updateApartment as updateApartmentService,
        deleteApartment as deleteApartmentService
} from "../services/ApartmentService.js"

export const createApartment = async(req, res) => {

    //lay du lieu tu body
    const {code, floor, area, status} = req.body;

    //goi ham tao 

    const result = await createApartmentService({code, floor, area, status});

    //tra ket qua 

    res.status(201).json(result);

}

export const getApartments = async(req, res) => {
    //lay du lieu tu query
    const {page, limit} = req.query;

    // goi service
    const result = await getApartmentsService({
        page,
        limit
    });

    //tra response
    res.status(200).json(result);
}

export const updateApartment = async (req, res) => {
    const { id } = req.params;

    const data = req.body;

    const result = await updateApartmentService(id, data);

    res.status(200).json(result);
}

export const deleteApartment = async (req, res) => {
    const { id } = req.params;

    const result = await deleteApartmentService(id);

    res.status(200).json(result);
}

