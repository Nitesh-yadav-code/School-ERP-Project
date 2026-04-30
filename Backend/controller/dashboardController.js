import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";
import StudentEnrollment from "../models/StudentEnrollment.js";
import Teacher from "../models/Teacher.js";
import Class from "../models/Class.js";
import FeePayment from "../models/FeePayment.js";
import FeeAssignment from "../models/FeeAssignment.js";

/**
 * Dashboard stats (ERP-correct, string academicYear)
 */
export const getDashboardStats = async (req, res) => {
  try {
    const accountId = new mongoose.Types.ObjectId(req.tenantAccountId);
    const { academicYear } = req.query;

    if (!academicYear) {
      return res.status(400).json({
        success: false,
        message: "academicYear is required",
      });
    }

    // 🔹 Today range
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // 🔹 Month range
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // 1️⃣ Total Students (current academic year)
    const totalStudents = await StudentEnrollment.countDocuments({
      academicYear,
      isActive: true,
      accountId,
    });

    // 2️⃣ Total Teachers
    const totalTeachers = await Teacher.countDocuments({
      accountId,
      isActive: true,
    });

    // 3️⃣ Total Classes
    const totalClasses = await Class.countDocuments({
      accountId,
    });

    // 4️⃣ Attendance Today
    const totalMarkedToday = await Attendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      academicYear,
      accountId,
    });

    const totalPresentToday = await Attendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      academicYear,
      status: "Present",
      accountId,
    });

    const todayAttendanceRate =
      totalMarkedToday > 0
        ? Number(((totalPresentToday / totalMarkedToday) * 100).toFixed(1))
        : 0;

    // 5️⃣ Fees Collected This Month
    const monthlyFeesAgg = await FeePayment.aggregate([
      {
        $match: {
          accountId,
          paymentDate: { $gte: monthStart, $lte: monthEnd },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amountPaid" },
        },
      },
    ]);

    const monthlyFeesCollected =
      monthlyFeesAgg.length > 0 ? monthlyFeesAgg[0].total : 0;

    // 6️⃣ Recent Payments (last 5)
    const recentPayments = await FeePayment.find({ accountId })
      .sort({ paymentDate: -1 })
      .limit(5)
      .populate({
        path: "feeAssignmentId",
        populate: {
          path: "studentEnrollmentId",
          populate: {
            path: "studentId",
            select: "firstName lastName",
          },
        },
      });

    // 7️⃣ Today’s Absentees (top 10)
    const absenteesToday = await Attendance.find({
      date: { $gte: today, $lt: tomorrow },
      academicYear,
      status: "Absent",
      accountId,
    })
      .limit(10)
      .populate({
        path: "studentEnrollmentId",
        populate: {
          path: "studentId",
          select: "firstName lastName",
        },
      });

    // 8️⃣ Total Pending Fees (global)
    const pendingFeesAgg = await FeeAssignment.aggregate([
      { $match: { accountId } },
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
          paidAmount: { $sum: "$payments.amountPaid" },
        },
      },
      {
        $group: {
          _id: null,
          totalFee: { $sum: "$amount" },
          totalPaid: { $sum: "$paidAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          pending: { $subtract: ["$totalFee", "$totalPaid"] },
        },
      },
    ]);

    const totalPendingFees =
      pendingFeesAgg.length > 0 ? pendingFeesAgg[0].pending : 0;

    // ✅ Response
    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalTeachers,
        totalClasses,
        todayAttendanceRate,
        monthlyFeesCollected,
        totalPendingFees,
        recentPayments,
        absenteesToday,
      },
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
