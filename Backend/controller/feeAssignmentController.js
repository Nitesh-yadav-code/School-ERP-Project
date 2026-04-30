import FeeAssignment from "../models/FeeAssignment.js";
import FeeStructure from "../models/FeeStructure.js";
import StudentEnrollment from "../models/StudentEnrollment.js";

/**
 * Assign fees to a student enrollment
 * Admin / SuperAdmin
 */
export const assignFeesToEnrollment = async (req, res) => {
  try {
    const { studentEnrollmentId, feeStructureIds, dueDate } = req.body;

    if (
      !studentEnrollmentId ||
      !Array.isArray(feeStructureIds) ||
      feeStructureIds.length === 0 ||
      !dueDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "studentEnrollmentId, feeStructureIds[] and dueDate are required",
      });
    }

    // Validate enrollment
    const enrollment = await StudentEnrollment.findOne({
      _id: studentEnrollmentId,
      accountId: req.tenantAccountId,
      isActive: true,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Active student enrollment not found",
      });
    }

    // Fetch fee structures
    const feeStructures = await FeeStructure.find({
      _id: { $in: feeStructureIds },
      accountId: req.tenantAccountId,
    });

    if (feeStructures.length !== feeStructureIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more fee structures are invalid",
      });
    }

    const assignments = feeStructures.map((fee) => ({
      studentEnrollmentId,
      feeStructureId: fee._id,
      amount: fee.amount,
      dueDate,
      accountId: req.tenantAccountId,
    }));

    const createdAssignments = await FeeAssignment.insertMany(assignments);

    return res.status(201).json({
      success: true,
      assignments: createdAssignments,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get fee assignments for a student enrollment
 * Admin / Teacher / Parent (read-only)
 */
export const getFeeAssignmentsByEnrollment = async (req, res) => {
  try {
    const { studentEnrollmentId } = req.params;

    if (!studentEnrollmentId) {
      return res.status(400).json({
        success: false,
        message: "studentEnrollmentId is required",
      });
    }

    const query = {
      studentEnrollmentId,
    };

    if (req.user.role !== "SuperAdmin") {
      query.accountId = req.tenantAccountId;
    }

    const assignments = await FeeAssignment.find(query)
      .populate("feeStructureId", "name")

    return res.status(200).json({
      success: true,
      assignments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update fee assignment (due date / amount override)
 */
export const updateFeeAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const query = { _id: id };

    if (req.user.role !== "SuperAdmin") {
      query.accountId = req.tenantAccountId;
    }

    const assignment = await FeeAssignment.findOneAndUpdate(
      query,
      req.body,
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Fee assignment not found",
      });
    }

    return res.status(200).json({
      success: true,
      assignment,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Remove fee assignment
 */
export const deleteFeeAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const query = { _id: id };

    if (req.user.role !== "SuperAdmin") {
      query.accountId = req.tenantAccountId;
    }

    const assignment = await FeeAssignment.findOneAndDelete(query);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Fee assignment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fee assignment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
