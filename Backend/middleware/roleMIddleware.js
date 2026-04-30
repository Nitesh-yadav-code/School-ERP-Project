export const roleMiddleware = (allowedRoles)=>{
    return (req, res, next)=> {
        try {
            const userRole = req.user.role;

            if(!allowedRoles.includes(userRole)){
                return res.status(403).json({
                    sucess: false,
                    message: "Access denied, You do not have Permission",
                })
            }

            next();
        } catch (error) {
             res.status(500).json({ success: false, message: error.message });
        }
    }
}