import FeeSetup from "../models/FeeSetup.js";

export const createFeeSetup = async (req, res) => {
  try {
    const { classId, monthlyFee, admissionFee, extraFees } = req.body;

    const exist = await FeeSetup.findOne({ classId });
    
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Fee structure already exists for this class.",
      });
    }

    const feeSetup = await FeeSetup.create({
      classId,
      monthlyFee,
      admissionFee,
      extraFees
    })
    res.status(200).json({sucess:true, feeSetup})
  } catch (error) {
    res.status(400).json({ sucess: false, message: error.message });
  }
};


export const getFeeByClass = async(req, res)=>{
  try {
    const classId = req.params.classId
    const fee = await FeeSetup.findOne({classId}).populate("classId", "name");

    res.status(200).json({ success: true, fee });

  } catch (error) {
    res.status(400).json({ sucess: false, message: error.message });
  }
}
