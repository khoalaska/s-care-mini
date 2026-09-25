import {
  createApartment as createApartmentService,
  getApartments as getApartmentsService,
  updateApartment as updateApartmentService,
  deleteApartment as deleteApartmentService,
} from "../services/ApartmentService.js";

export const createApartment = async (req, res) => {
  //lay du lieu tu body
  let { code, floor, area, status } = req.body;

  if (floor !== undefined) floor = Number(floor);
  if (area !== undefined) area = Number(area);

  //goi ham tao

  const result = await createApartmentService({ code, floor, area, status });

  //tra ket qua

  res.status(201).json(result);
};

export const getApartments = async (req, res) => {
  //lay du lieu tu query
  const { page, limit } = req.query;

  // goi service
  const result = await getApartmentsService({
    page,
    limit,
  });

  //tra response
  res.status(200).json(result);
};

export const updateApartment = async (req, res) => {
  const { id } = req.params;

  const data = req.body;
  
  if (data.floor !== undefined) data.floor = Number(data.floor);
  if (data.area !== undefined) data.area = Number(data.area);

  const result = await updateApartmentService(id, data);

  res.status(200).json(result);
};

export const deleteApartment = async (req, res) => {
  const { id } = req.params;

  const result = await deleteApartmentService(id);

  res.status(200).json(result);
};
