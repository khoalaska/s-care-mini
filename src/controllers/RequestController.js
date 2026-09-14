import { createRequest as createRequestService,
        getRequests as getRequestsService,
        uploadImages as uploadImageService
 } from "../services/RequestService.js";

export const createRequest = async (req, res) => {
    //Lấy type, description, priority 
    const {type, description, priority} = req.body;

    //lay id
    const created_by = req.user.userId;

    // goi service
    const result = await createRequestService({type, description, priority, created_by});

    // tra ket qua
    res.status(201).json(result);

}

export const getRequests = async (req, res) => {
    //lay filter/page
        const {
        page,
        limit,
        status,
        type,
        priority,
        search,
        from_date,
        to_date
    } = req.query;

    //lay userid, role
    const {userId, role} = req.user;

    //goi service
    const result = await getRequestsService({
    page,
    limit,
    userId,
    role,
    status,
    type,
    priority,
    search,
    from_date,
    to_date
    });

    //tra ket qua
    res.status(200).json(result);

}

export const uploadImages = async (req, res) => {
    const requestId = req.params.id;

    const userId = req.user.userId;

    const files = req.files;

    const result = await uploadImageService(requestId, userId, files);

    res.status(201).json(result);


}