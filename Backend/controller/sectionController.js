import Section from "../models/Section.js";

/**
 * Create Section
 */
export const createSection = async (req, res) => {
  try {
    const { name, classId, academicYear } = req.body;

    if (!name || !classId || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "name, classId and academicYear are required",
      });
    }

    const section = await Section.create({
      name,
      classId,
      academicYear,
      accountId: req.tenantAccountId,
    });

    return res.status(201).json({
      success: true,
      section,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Sections by Class
 */
export const getSectionsByClass = async (req, res) => {
  try {
    const { academicYear, classId } = req.query;

    const query = {
      isActive: true,
    };

    // Only add filters if they are provided
    if (classId) {
      query.classId = classId;
    }

    if (academicYear) {
      query.academicYear = academicYear;
    }

    if (req.user.role !== "SuperAdmin") {
      query.accountId = req.tenantAccountId;
    }

    const sections = await Section.find(query);

    return res.status(200).json({
      success: true,
      sections,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
