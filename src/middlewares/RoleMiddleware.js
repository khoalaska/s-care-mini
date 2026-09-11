

//cấu hình role nào được xử lí 
export const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
    
    if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: "Bạn không có quyền thực hiện thao tác này"
            });
        }
    
    next();
    }; 
};