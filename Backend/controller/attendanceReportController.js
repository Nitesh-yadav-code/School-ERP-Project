import Attendance from "../models/Attendance.js";
import StudentEnrollment from "../models/StudentEnrollment.js";

export const getStudentMonthlyAttendance = async(req, res)=>{
    try {
        
    const {studentId, academicYear, month}  = req.query;
    if(!studentId || !academicYear || month === undefined){
        res.status(400).json({message: "Student Id, academinYear, month is required"});
    }

    const enrollment = await StudentEnrollment.findOne({
        studentId: studentId,
        academicYear: academicYear,
        isActive: true,
         accountId: req.tenantAccountId,
    })
    const startDate = new Date(
      new Date().getFullYear(),
      Number(month),
      1
    );
    const endDate = new Date(
      new Date().getFullYear(),
      Number(month) + 1,
      0
    );
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    const attendance = await Attendance.find({
        studentEnrollmentId: enrollment._id,
        academicYear: academicYear,
        date: { $gte: startDate, $lte: endDate },
          accountId: req.tenantAccountId,
    })

    const summary = {
        totalDays : attendance.length,
        present: attendance.filter((pre)=> pre.status === "Present").length,
        abjent: attendance.filter((pre)=> pre.status === "Absent").length,
        leave: attendance.filter((pre)=> pre.status === "Leave").length,
    }
    summary.percentage =
      summary.totalDays === 0
        ? 0
        : ((summary.present / summary.totalDays) * 100).toFixed(2);

    return res.status(200).json({
      success: true,
      summary,
    });

     } catch (error) {
        return res.status(500).json({
      success: false,
      message: error.message,
    });
    }
}

export const getClassMonthlyAttendance = async(req, res)=>{
    try {
        const {classId, sectionId, academicYear, month} = req.body;

        if (!classId || !sectionId || !academicYear || month === undefined) {
      return res.status(400).json({
        success: false,
        message: "classId, sectionId, academicYear and month are required",
      });
    }

    const startDate = new Date(
      new Date().getFullYear(),
      Number(month),
      1
    );
    const endDate = new Date(
      new Date().getFullYear(),
      Number(month) + 1,
      0
    );

      const enrollments = await StudentEnrollment.find({
        studentId: studentId,
        classId,
        sectionId,
        academicYear: academicYear,
        isActive: true,
         accountId: req.tenantAccountId,
    }).populate("studentId", "firstName lastName");

      if (!enrollments) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }
    const enrollmentIds = enrollments.map((enroll)=> enroll._id);

    const attendance = await Attendance.find({
        studentEnrollmentId: {$in: enrollmentIds },
        academicYear,
        date: { $gte: startDate, $lte: endDate },
        accountId: req.tenantAccountId
        
    })

     // Build student-wise report
    const report = enrollments.map(enrollment => {
      const studentAttendance = attendance.filter(
        a => a.studentEnrollmentId.toString() === enrollment._id.toString()
      );

      const totalDays = studentAttendance.length;
      const present = studentAttendance.filter(a => a.status === "Present").length;

      return {
        studentId: enrollment.studentId._id,
        name: `${enrollment.studentId.firstName} ${enrollment.studentId.lastName}`,
        totalDays,
        present,
        percentage:
          totalDays === 0 ? 0 : ((present / totalDays) * 100).toFixed(2),
      };
    });

    return res.status(200).json({
      success: true,
      report,
    });
    } catch (error) {
        
    }
}