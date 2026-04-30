import Teacher from "../models/Teacher.js";
import TeacherAssignmentSchema from "../models/TeacherAssignmentSchema.js";

export const assignTeacher = async (req, res) => {
  try {
    const { teacherId, classSubjectId, sectionId, academicYear } = req.body;

    if (!teacherId || !classSubjectId || !academicYear) {
      return res.status(400).json({
        message: "teacherId, classSubjectId and academicYear are required",
      });
    }

    const assignment = await TeacherAssignmentSchema.create({
      teacherId,
      classSubjectId,
      sectionId,
      academicYear,
      accountId: req.tenantAccountId,
    });

    res.status(201).json({
      success: true,
      assignment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTeacherAssignments = async (req, res) => {
  try {
    const { teacherId, academicYear } = req.query;
    const query = {};
     if (!academicYear) {
      return res.status(400).json({
        success: false,
        message: "academicYear is required",
      });
    }
    if (academicYear) query.academicYear = academicYear;

    if (req.user.role !== "SuperAdmin") {
      query.accountId = req.tenantAccountId;
    }
    if (req.user.role === "Teacher") {
      const teacher = await Teacher.findOne({
        userId: req.user._id,
        accountId: req.tenantAccountId,
      });
      if (!teacher) {
        return res.status(403).json({
          success: false,
          message: "Teacher profile not found",
        });

        
      }
       query.teacherId = teacher._id;

    }else if(teacherId){
        query.teacherId = teacherId;
      }

    const assignments = await TeacherAssignmentSchema.find(query)
      .populate({
        path: "classSubjectId",
        populate: [
          { path: "classId", select: "name" },
          { path: "subjectId", select: "name" },
        ],
      })
      .populate("sectionId", "name");

    res.status(200).json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
