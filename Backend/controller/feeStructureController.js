import express from "express";
import FeeStructure from "../models/FeeStructure.js";

const router = express.Router();

export const createFeeStructure = async (req, res) => {
  try {
    const { name, amount, classId, academicYear, isMandatory } = req.body;

    if (!name || !amount || !classId || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "name, amount, classId and academicYear are required",
      });
    }
    const feeStructure = await FeeStructure.create({
      name,
      amount,
      classId,
      academicYear,
      isMandatory,
      accountId: req.tenantAccountId,
    });

    return res.status(201).json({
      success: true,
      feeStructure,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFeeStructures = async (req, res) => {
  try {
    const { classId, academicYear } = req.query;
    if (!classId || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "classId and academicYear are required",
      });
    }
    const query = {
      classId,
      academicYear,
    };
    if (req.user.role !== "SuperAdmin") {
      query.accountId = req.tenantAccountId;
    }

    const feeStructures = await FeeStructure.find(query).populate(
      "classId",
      "name"
    );

    return res.status(200).json({
      success: true,
      feeStructures,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const query = {
      _id: id,
    };
    if (req.user.role !== "SuperAdmin") {
      query.accountId = req.tenantAccountId;
    }
    const feeStructure = await FeeStructure.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true,
    });

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }

    return res.status(200).json({
      success: true,
      feeStructure,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;

    const query = { _id: id };

    if (req.user.role !== "SuperAdmin") {
      query.accountId = req.tenantAccountId;
    }

    const feeStructure = await FeeStructure.findOneAndDelete(query);

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fee structure deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export default router;
