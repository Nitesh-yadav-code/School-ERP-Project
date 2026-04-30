import mongoose from "mongoose";
import Account from "../models/Account.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createAccountWithAdmin = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      name,
      code,
      type,
      contact,
      address,
      registrationNumber,
      board,
      academicYearStart,
      subscription,
      limits,
      modules,
      branding,
      notes,

      //first admin data
      admin,
    } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Account name is required",
      });
    }

    if (!admin || !admin.email || !admin.password || !admin.name) {
      return res.status(400).json({
        success: false,
        message: "Admin name, email and password are required",
      });
    }

     // Duplicate check
    const existing = await Account.findOne({ code });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Account code already exists. Please use a different code.",
      });
    }

    const [account] = await Account.create(
      [
        {
          name,
          code,
          type,
          contact,
          address,
          registrationNumber,
          board,
          academicYearStart,
          subscription,
          limits,
          modules,
          branding,
          notes,
          createdBy: req.user._id, // SuperAdmin
        },
      ],
      { session }
    );
    const hashedPassword = await bcrypt.hash(admin.password, 10);

    const [adminUser] = await User.create(
      [
        {
          name: admin.name,
          email: admin.email,
          password: hashedPassword,
          role: "Admin",
          permissions: admin.permissions || [],
          accountId: account._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
      success: true,
      message: "Account and Admin created successfully",
      account,
      admin: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error)
    res.status(500).json({ message: "Server Error" });
  }
};


export const getAccounts = async(req, res)=>{
  try {
    const accountData = await Account.find();

    res.status(200).json({message: "Account Fetched SucessFully", accountData})
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server Error" });
  }
}
