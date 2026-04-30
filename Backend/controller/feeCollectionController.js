import FeePayment from "../models/FeePayment.js";


export const payFees = async (req, res) => {

        const generateReceiptId = () => {
    return "RCPT-" + Date.now();
    };

  try {
    const { studentId, classId, month, amountPaid, paymentMode, remarks } = req.body;

    const receiptId = generateReceiptId();

    const payment = await FeePayment.create({
      studentId,
      classId,
      month,
      amountPaid,
      paymentMode,
      remarks,
      receiptId,
      paidBy: req.user.id
    });

    res.status(201).json({ success: true, payment });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getFeesByStudent = async (req, res) => {
  try {
    const payments = await FeePayment.find({ studentId: req.params.id })
      .populate("classId", "name");

    res.status(200).json({ success: true, payments });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getFeeReport = async (req, res) => {
  try {
    const payments = await FeePayment.find()
      .populate("studentId", "firstName lastName")
      .populate("classId", "name");

    res.status(200).json({ success: true, payments });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

