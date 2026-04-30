import StudentEnrollment from "../models/StudentEnrollment.js";

export const promotStudents = async(req, res)=>{

    try {
        const {
            studentIds,
            fromAcademicYear,
            toAcademicYear,
            newClassId,
            newSectionId,
        } = req.body;
        if (!studentIds || !fromAcademicYear || !toAcademicYear || !newClassId || !newSectionId ) {
      return res.status(400).json({
        success: false,
        message: "All promotion fields are required",
      });
    }
    await StudentEnrollment.updateMany({
        studentId: {$in : studentIds},
        academicYear : fromAcademicYear,
        isActive : true,
        accountId : req.tenantAccountId,
    }, {isActive: false})

    const newEnrollments = studentIds.map((studentId)=>({
        studentId,
      classId: newClassId,
      sectionId: newSectionId,
      academicYear: toAcademicYear,
      accountId: req.tenantAccountId,
    }))

    await StudentEnrollment.insertMany(newEnrollments)

     return res.status(200).json({
      success: true,
      message: "Students promoted successfully",
    });

    } catch (error) {
         return res.status(500).json({
      success: false,
      message: error.message,
    });
    }
}