import mongoose from "mongoose";

const FeePaymentSchema = new mongoose.Schema(
  {
    feeAssignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeAssignment",
      required: true,
    },

    amountPaid: {
      type: Number,
      required: true,
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },

    paymentMode: {
      type: String,
      enum: ["cash", "upi", "card", "bank"],
    },

    receiptNo: String,

    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
  },
  { timestamps: true }
);

FeePaymentSchema.index({ feeAssignmentId: 1, accountId: 1 });


export default mongoose.model("FeePayment", FeePaymentSchema);
