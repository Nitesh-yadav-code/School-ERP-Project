import ClassSubject from "../models/ClassSubject.js";

/**
 * Create Class-Subject mapping
 */
export const createClassSubject = async (req, res) => {
  try {
    const { classId, subjectId, academicYear } = req.body;

    if (!classId || !subjectId || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "classId, subjectId and academicYear are required",
      });
    }

    const classSubject = await ClassSubject.create({
      classId,
      subjectId,
      academicYear,
      accountId: req.tenantAccountId,
    });

    return res.status(201).json({
      success: true,
      classSubject,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get subjects for a class (year + tenant safe)
 */
export const getClassSubjects = async (req, res) => {
  try {
    const { classId, academicYear } = req.query;

    if (!classId || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "classId and academicYear are required",
      });
    }

    const query = {
      classId,
      academicYear,
      isActive: true,
    };

    if (req.user.role !== "SuperAdmin") {
      query.accountId = req.tenantAccountId;
    }

    const classSubjects = await ClassSubject.find(query)
      .populate("subjectId", "name")
      .populate("classId", "name");

    return res.status(200).json({
      success: true,
      classSubjects,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
