import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createTeacher = async (req, res) => {
  try {
    const { name, email, phone, enableLogin, password } = req.body;

    // 1️⃣ Basic validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Teacher name is required",
      });
    }

    // 2️⃣ Create Teacher (academic entity)
    const teacher = await Teacher.create({
      name,
      email,
      phone,
      accountId: req.tenantAccountId,
    });

    let user = null;

    // 3️⃣ Optional login creation
    if (enableLogin) {
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required to enable login",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "Teacher",
        permissions: ["TEACHER_VIEW"],
        accountId: req.tenantAccountId,
      });

      // 4️⃣ Link Teacher ↔ User
      teacher.userId = user._id;
      await teacher.save();
    }

    return res.status(201).json({
      success: true,
      teacher,
      loginEnabled: !!user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTeachers = async (req, res) => {
  try {
    const query = {};

    if (req.user.role !== "SuperAdmin") {
      query.accountId = req.tenantAccountId;
    }

    const teachers = await Teacher.find(query)
      .populate("userId", "email role")

    res.status(200).json({
      success: true,
      teachers,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const query = {
      _id: req.params.id,
    };

    if (req.user.role !== "SuperAdmin") {
      query.accountId = req.tenantAccountId;
    }

    const teacher = await Teacher.findOne(query)
      .populate("userId", "email role");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      teacher,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateTeacher = async (req, res) => {
  try {
    const query = {
      _id: req.params.id,
    };

    if (req.user.role !== "SuperAdmin") {
      query.accountId = req.tenantAccountId;
    }

    const teacher = await Teacher.findOneAndUpdate(
      query,
      req.body,
      { new: true, runValidators: true }
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found or access denied",
      });
    }

    res.status(200).json({
      success: true,
      teacher,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const query = {
      _id: req.params.id,
    };

    if (req.user.role !== "SuperAdmin") {
      query.accountId = req.tenantAccountId;
    }

    const teacher = await Teacher.findOne(query);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Soft delete teacher
    teacher.isActive = false;
    await teacher.save();

    // Disable login user if exists
    if (teacher.userId) {
      await User.findByIdAndUpdate(teacher.userId, {
        isActive: false,
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher removed successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

