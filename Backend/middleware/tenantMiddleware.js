export const tenantMiddleware = () => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { role, accountId } = req.user;

    // SuperAdmin can access everything
    if (role === "SuperAdmin") {
      return next();
    }

    if (!accountId) {
      return res.status(403).json({
        message: "Company not assigned"
      });
    }

    req.tenantAccountId = accountId;            

    next();
  };
};
