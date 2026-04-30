import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";
import StudentEnrollment from "../models/StudentEnrollment.js";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";

export const markAttendance = async (req, res) => {
  try {
    const { date, enrollments } = req.body;
    // enrollments = [{ studentEnrollmentId, status }]

    if (!date || !Array.isArray(enrollments) || enrollments.length === 0) {
      return res.status(400).json({
        success: false,
        message: "date and enrollments[] are required",
      });
    }

    // Teacher validation
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
    }

    const enrollmentIds = enrollments.map(e => e.studentEnrollmentId);

    const validEnrollments = await StudentEnrollment.find({
      _id: { $in: enrollmentIds },
      isActive: true,
      accountId: req.tenantAccountId,
    });

    if (validEnrollments.length !== enrollmentIds.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid student enrollment detected",
      });
    }

    const enrollmentMap = new Map();
    validEnrollments.forEach(e => enrollmentMap.set(e._id.toString(), e));

    const bulkOps = enrollments.map(e => {
      const enrollment = enrollmentMap.get(e.studentEnrollmentId);

      return {
        updateOne: {
          filter: {
            studentEnrollmentId: e.studentEnrollmentId,
            date: new Date(date),
            accountId: req.tenantAccountId,
          },
          update: {
            $set: {
              status: e.status,
              markedBy: req.user.id,
              classId: enrollment.classId,
              sectionId: enrollment.sectionId,
              academicYear: enrollment.academicYear,
              accountId: req.tenantAccountId,
            },
          },
          upsert: true,
        },
      };
    });
// ...existing code...
    // console.log("markedBy value:", req.user._id);
    // console.log("markedBy type:", typeof req.user._id);


    await Attendance.bulkWrite(bulkOps);

    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
    });

  } catch (error) {
    console.error("Attendance error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAttendanceByClass = async (req, res) => {
  try {
    const { classId, sectionId, date, academicYear } = req.query;

    if (!classId || !sectionId || !date || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "classId, sectionId, date, academicYear are required",
      });
    }

    const enrollments = await StudentEnrollment.find({
      classId,
      sectionId,
      academicYear,
      isActive: true,
      accountId: req.tenantAccountId,
    })
      .populate("studentId", "firstName lastName")
      .sort({ rollNumber: 1 });

    const enrollmentIds = enrollments.map(e => e._id);

    const attendanceRecords = await Attendance.find({
      studentEnrollmentId: { $in: enrollmentIds },
      date: new Date(date),
      accountId: req.tenantAccountId,
    });

    // Manually populate markedBy
    const markedByIds = attendanceRecords
      .filter(a => a.markedBy)
      .map(a => a.markedBy);
    
    const users = await User.find({ _id: { $in: markedByIds } }).select("name");
    const userMap = new Map(users.map(u => [u._id.toString(), u]));

    const attendanceMap = new Map();
    attendanceRecords.forEach(a =>
      attendanceMap.set(a.studentEnrollmentId.toString(), {
        ...a.toObject(),
        markedBy: a.markedBy ? userMap.get(a.markedBy.toString()) || null : null
      })
    );

    const result = enrollments.map(e => {
      const record = attendanceMap.get(e._id.toString());
      return {
        studentEnrollmentId: e._id,
        rollNumber: e.rollNumber,
        studentName: `${e.studentId.firstName} ${e.studentId.lastName}`,
        status: record?.status || null,
        markedBy: record?.markedBy || null,
        date,
      };
    });

    res.status(200).json({ success: true, attendance: result });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAttendanceByStudent = async (req, res) => {
  try {
    const { studentEnrollmentId, startDate, endDate } = req.query;

    if (!studentEnrollmentId) {
      return res.status(400).json({
        success: false,
        message: "studentEnrollmentId is required",
      });
    }

    const query = {
      studentEnrollmentId,
      accountId: req.tenantAccountId,
    };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(query)
      .populate("markedBy", "name")
      .sort({ date: -1 });

    const total = attendance.length;
    const present = attendance.filter(a => a.status === "Present").length;
    const absent = attendance.filter(a => a.status === "Absent").length;
    const leave = attendance.filter(a => a.status === "Leave").length;

    res.status(200).json({
      success: true,
      attendance,
      summary: {
        total,
        present,
        absent,
        leave,
        percentage: total ? ((present / total) * 100).toFixed(1) : 0,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

