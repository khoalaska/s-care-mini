export const errorMiddleware = (err, req, res, next) => {
    //lay status
    const statusCode = err.statusCode || 500;

    //tra ket qua
    res.status(statusCode).json({
        message: err.message || "Internal Server Error"
    });

}