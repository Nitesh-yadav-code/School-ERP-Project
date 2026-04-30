import StudentEnrollment from "../models/StudentEnrollment.js";

export const enrollStudent = async (req, res) => {
  try {
    const { studentId, classId, sectionId, academicYear, rollNumber } = req.body;

    if (!studentId || !classId || !sectionId || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "studentId, classId, sectionId and academicYear are required",
      });
    }

    const enrollment = await StudentEnrollment.create({
      studentId,
      classId,
      sectionId,
      academicYear,
      rollNumber,
      accountId: req.tenantAccountId,
    });

    return res.status(201).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const getEnrollStudents = async(req, res)=>{
  try {
    const {classId, sectionId, academicYear} = req.query;
    if(!classId || !sectionId || !academicYear){
      return res.status(400).json({message : "classId, sectionId, academicYear is required"})
    }
    const query = {
       classId,
      sectionId,
      academicYear,
      isActive :true,
    }
    if(req.user.role !== "SuperAdmin")[
      query.accountId = req.tenantAccountId
    ]
    const enrollments = await StudentEnrollment.find(query)
    .populate({
      path: "studentId",
      select: "firstName lastName" 
    })
    .populate({
      path:"classId",
      select: "name"
    })
    .populate({
      path:"sectionId",
      select: "name"
    })

    res.status(200).json({message: 'Students fetch Sucessfully', enrollments})
  } catch (error) {
     return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
export const changeSection = async (req, res)=> {
  try {
    const {enrollmentId, newSectionId} = req.body;
    if(!enrollmentId || !newSectionId){
      return res.status(400).json({message: "Enrollement Id and section Id is required"})
    }
   const enrollment = await StudentEnrollment.findOneAndUpdate({
      accountId: req.tenantAccountId,
      _id : enrollmentId,
      isActive: true
    }, {sectionId : newSectionId}, {new: true})

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Active enrollment not found",
      });
    }

    return res.status(200).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
export const getCurrentEnrollment = async (req, res) => {
  try {
    const { studentId, academicYear } = req.query;

    if (!studentId || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "studentId and academicYear are required",
      });
    }

    const enrollment = await StudentEnrollment.findOne({
      studentId,
      academicYear,
      isActive: true,
      accountId: req.tenantAccountId,
    })
      .populate("classId", "name")
      .populate("sectionId", "name");

    return res.status(200).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEnrollmentHistory = async (req, res) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "studentId is required",
      });
    }

    const history = await StudentEnrollment.find({
      studentId,
      accountId: req.tenantAccountId,
    })
      .populate("classId", "name")
      .populate("sectionId", "name")

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};