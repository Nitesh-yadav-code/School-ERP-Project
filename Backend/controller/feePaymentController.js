import FeePayment from "../models/FeePayment.js";
import FeeAssignment from "../models/FeeAssignment.js";

/**
 * Make a fee payment (supports partial payments)
 * Admin / Cashier / SuperAdmin
 */
export const makeFeePayment = async (req, res) => {
  try {
    const {
      feeAssignmentId,
      amountPaid,
      paymentMode,
      receiptNo,
    } = req.body;

    if (!feeAssignmentId || !amountPaid || !paymentMode) {
      return res.status(400).json({
        success: false,
        message: "feeAssignmentId, amountPaid and paymentMode are required",
      });
    }

    // Fetch fee assignment
    const assignment = await FeeAssignment.findOne({
      _id: feeAssignmentId,
      accountId: req.tenantAccountId,
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Fee assignment not found",
      });
    }

    // Calculate total paid so far
    const payments = await FeePayment.find({
      feeAssignmentId,
      accountId: req.tenantAccountId,
    });

    const totalPaid = payments.reduce(
      (sum, p) => sum + p.amountPaid,
      0
    );

    const newTotalPaid = totalPaid + amountPaid;

    if (newTotalPaid > assignment.amount) {
      return res.status(400).json({
        success: false,
        message: "Payment exceeds due amount",
      });
    }

    // Create payment record
    const payment = await FeePayment.create({
      feeAssignmentId,
      amountPaid,
      paymentMode,
      receiptNo,
      accountId: req.tenantAccountId,
    });

    // Update assignment status
    let status = "pending";
    if (newTotalPaid === assignment.amount) {
      status = "paid";
    } else if (newTotalPaid > 0) {
      status = "partial";
    }

    assignment.status = status;
    await assignment.save();

    return res.status(201).json({
      success: true,
      payment,
      feeStatus: status,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get payment history for a fee assignment
 */
export const getFeePaymentsByAssignment = async (req, res) => {
  try {
    const { feeAssignmentId } = req.params;

    if (!feeAssignmentId) {
      return res.status(400).json({
        success: false,
        message: "feeAssignmentId is required",
      });
    }

    const query = {
      feeAssignmentId,
    };

    if (req.user.role !== "SuperAdmin") {
      query.accountId = req.tenantAccountId;
    }

    const payments = await FeePayment.find(query)

    return res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
