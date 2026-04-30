import StudentModel from "../models/StudentModel.js";

export const addStudent = async (req, res) => {
  try {
    const student = await StudentModel.create({
      ...req.body,
      accountId: req.tenantAccountId,
    });
    res.status(201).json({ sucess: true, student });
  } catch (error) {
    res.status(401).json({ sucess: false, message: error.message });
  }
};

export const getStudent = async (req, res) => {
  try {
    // const { classId, sectionId } = req.query;
    const query = {};

    if (req.user.role !== "SuperAdmin") {
      query.accountId = req.tenantAccountId;
    }
    console.log("accountId:", req.tenantAccountId);

    // if (classId) query.classId = classId;
    // if (sectionId) query.sectionId = sectionId;

    const students = await StudentModel.find(query)

    res.status(200).json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = {};
    if (req.user.role !== "SuperAdmin") {
      query.accountId = req.tenantAccountId;
    }
    if (id) query._id = id;
    const student = await StudentModel.findOne(query)
      .populate("classId", "name")
      .populate("sectionId", "name");

    if (!student) {
      return res
        .status(404)
        .json({ sucess: false, message: "Student Not found" });
    }
    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const query = { _id: id };

    // Tenant restriction
    if (req.user.role !== "SuperAdmin") {
      query.accountId = req.tenantAccountId;
    }

    const student = await StudentModel.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return res
        .status(404)
        .json({ sucess: false, message: "Student Not found" });
    }
    res.status(200).json({ success: true, student });
  } catch {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const query = { _id: id };

    if (req.user.role !== "SuperAdmin") {
      query.accountId = req.tenantAccountId;
    }

    const student = await StudentModel.findOneAndDelete(query);

    if (!student) {
      return res
        .status(404)
        .json({ sucess: false, message: "Student Not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Student deleted successfully" });
  } catch {
    res.status(400).json({ success: false, message: error.message });
  }
};
