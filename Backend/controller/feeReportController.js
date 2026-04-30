import FeeAssignment from "../models/FeeAssignment";
import FeePayment from "../models/FeePayment";
import StudentEnrollment from "../models/StudentEnrollment";
import mongoose from "mongoose";

// export const getStudentFeeSummary = async (req, res) => {
//   try {
//     const { studentEnrollmentId } = req.query;

//     if (!studentEnrollmentId) {
//       return res.status(400).json({
//         success: false,
//         message: "studentEnrollmentId is required",
//       });
//     }

//     const assignments = await FeeAssignment.find({
//       accountId: req.tenantAccountId,
//       studentEnrollmentId,
//     });
//     let totalFee = 0;
//     let totalPaid = 0;

//     for (const assignment of assignments) {
//       totalFee += assignment.amount;

//       const payments = await FeePayment.find({
//         accountId: req.tenantAccountId,
//         feeAssignmentId: assignment._id,
//       });

//       totalPaid += payments.reduce((sum, p) => sum + p.amountPaid, 0);
//     }

//     const dueAmount = totalFee - totalPaid;
//     return res.status(200).json({
//       success: true,
//       summary: {
//         totalFee,
//         totalPaid,
//         dueAmount,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


/**
 * OPTIMIZED: Student Fee Summary (Aggregation)
 */
export const getStudentFeeSummary = async (req, res) => {
  try {
    const { studentEnrollmentId } = req.params;

    if (!studentEnrollmentId) {
      return res.status(400).json({
        success: false,
        message: "studentEnrollmentId is required",
      });
    }

    const summary = await FeeAssignment.aggregate([
      {
        $match: {
          studentEnrollmentId: new mongoose.Types.ObjectId(studentEnrollmentId),
          accountId: new mongoose.Types.ObjectId(req.tenantAccountId),
        },
      },
      {
        $lookup: {
          from: "feepayments",
          localField: "_id",
          foreignField: "feeAssignmentId",
          as: "payments",
        },
      },
      {
        $addFields: {
          totalPaid: {
            $sum: "$payments.amountPaid",
          },
        },
      },
      {
        $group: {
          _id: null,
          totalFee: { $sum: "$amount" },
          totalPaid: { $sum: "$totalPaid" },
        },
      },
      {
        $project: {
          _id: 0,
          totalFee: 1,
          totalPaid: 1,
          dueAmount: { $subtract: ["$totalFee", "$totalPaid"] },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      summary: summary[0] || {
        totalFee: 0,
        totalPaid: 0,
        dueAmount: 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// export const getFeeDefaulters = async (req, res) => {
//   try {
//     const { classId, sectionId } = req.query;

//     if (!classId || !sectionId) {
//       return res.status(400).json({
//         success: false,
//         message: "classId and sectionId are required",
//       });
//     }

//     const enrollments = await StudentEnrollment.find({
//       accountId: req.tenantAccountId,
//       isActive: true,
//       classId,
//       sectionId,
//     }).populate("studentId", "firstName lastName");

//     const defaulters = [];
//     for (const enrollment of enrollments) {

//       const assignments = await FeeAssignment.find({
//         accountId: req.tenantAccountId,
//         studentEnrollmentId: enrollment._id,
//       });

//       let totalPaid = 0;
//       let totalFee = 0;

//       for(const assignment of assignments){
//         totalFee += assignment.amount;
//         const payments = FeePayment.find({
//             accountId: req.tenantAccountId,
//             feeAssignmentId: assignment._id
//         });
//          totalPaid += payments.reduce(
//           (sum, p) => sum + p.amountPaid,
//           0
//         );

//       }
//       const dueAmount = totalFee - totalPaid;
//       if(dueAmount > 0){
//         defaulters.push({
//            studentId: enrollment.studentId._id,
//           name: `${enrollment.studentId.firstName} ${enrollment.studentId.lastName}`,
//           totalFee,
//           totalPaid,
//           dueAmount,
//         })
//       }

//       return res.status(200).json({
//       success: true,
//       defaulters,
//     });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

/**
 * OPTIMIZED: Fee Defaulters Report
 */
export const getFeeDefaulters = async (req, res) => {
  try {
    const { classId, sectionId } = req.query;

    if (!classId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "classId and sectionId are required",
      });
    }

    const defaulters = await StudentEnrollment.aggregate([
      {
        $match: {
          classId: new mongoose.Types.ObjectId(classId),
          sectionId: new mongoose.Types.ObjectId(sectionId),
          isActive: true,
          accountId: new mongoose.Types.ObjectId(req.tenantAccountId),
        },
      },
      {
        $lookup: {
          from: "feeassignments",
          localField: "_id",
          foreignField: "studentEnrollmentId",
          as: "assignments",
        },
      },
      { $unwind: "$assignments" },
      {
        $lookup: {
          from: "feepayments",
          localField: "assignments._id",
          foreignField: "feeAssignmentId",
          as: "payments",
        },
      },
      {
        $addFields: {
          paidAmount: { $sum: "$payments.amountPaid" },
        },
      },
      {
        $group: {
          _id: "$_id",
          studentId: { $first: "$studentId" },
          totalFee: { $sum: "$assignments.amount" },
          totalPaid: { $sum: "$paidAmount" },
        },
      },
      {
        $project: {
          studentId: 1,
          totalFee: 1,
          totalPaid: 1,
          dueAmount: { $subtract: ["$totalFee", "$totalPaid"] },
        },
      },
      {
        $match: {
          dueAmount: { $gt: 0 },
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      {
        $project: {
          name: {
            $concat: ["$student.firstName", " ", "$student.lastName"],
          },
          totalFee: 1,
          totalPaid: 1,
          dueAmount: 1,
        },
      },
      { $sort: { dueAmount: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      defaulters,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};