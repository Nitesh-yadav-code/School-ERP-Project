export const permissionMiddleware = (allowedPermissions) => {
  return (req, res, next) => {
    if (req.user.role === "SuperAdmin") {
      return next();
    }
    const userpermissions = req.user.permissions || [];

    const allowed = allowedPermissions.every((p) =>
      userpermissions.includes(p)
    );

    if (!allowed) {
      return res.status(403).json({ message: "Permission denied" });
    }

    next();
  };
};
