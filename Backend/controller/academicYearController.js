import AcademicYear from "../models/AcademicYear.js";

/**
 * Create Academic Year
 * (Admin / SuperAdmin)
 */
export const createAcademicYear = async (req, res) => {
  try {
    const { name, startDate, endDate, isCurrent } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "name, startDate and endDate are required",
      });
    }

    // If setting as current, unset existing current year
    if (isCurrent) {
      await AcademicYear.updateMany(
        { accountId: req.tenantAccountId, isCurrent: true },
        { isCurrent: false }
      );
    }

    const academicYear = await AcademicYear.create({
      name,
      startDate,
      endDate,
      isCurrent: !!isCurrent,
      accountId: req.tenantAccountId,
    });

    return res.status(201).json({
      success: true,
      academicYear,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all academic years
 */
export const getAcademicYears = async (req, res) => {
  try {
    const query =
      req.user.role === "SuperAdmin"
        ? {}
        : { accountId: req.tenantAccountId };

    const academicYears = await AcademicYear.find(query).sort({
      startDate: -1,
    });

    return res.status(200).json({
      success: true,
      academicYears,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get current academic year
 */
export const getCurrentAcademicYear = async (req, res) => {
  try {
    const academicYear = await AcademicYear.findOne({
      accountId: req.tenantAccountId,
      isCurrent: true,
    });

    return res.status(200).json({
      success: true,
      academicYear,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Close academic year
 * (used before promotion)
 */
export const closeAcademicYear = async (req, res) => {
  try {
    const { academicYearId } = req.params;

    const academicYear = await AcademicYear.findOneAndUpdate(
      {
        _id: academicYearId,
        accountId: req.tenantAccountId,
      },
      {
        status: "closed",
        isCurrent: false,
      },
      { new: true }
    );

    if (!academicYear) {
      return res.status(404).json({
        success: false,
        message: "Academic year not found",
      });
    }

    return res.status(200).json({
      success: true,
      academicYear,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
