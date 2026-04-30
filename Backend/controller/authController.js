
import User from "../models/User.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" })
    }
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" })
    }

    const passwordValid = await bcrypt.compare(password, existingUser.password);

    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid Credential" })
    }
    console.log(existingUser, "hii")

    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role, assignedClasses: existingUser.assignedClasses,
         assignedSections: existingUser.assignedSections,
        permissions:existingUser.permissions,
      accountId:existingUser.accountId },
      process.env.JWT_SECRET, { expiresIn: "1d" })

    res.status(200).json({
      message: "Login Successfully",
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        permissions: existingUser.permissions,
        accountId:existingUser.accountId
      },

      authToken: token
    })

  } catch (error) {
    console.error("Error during Login", error);
    res.status(500).json({ message: "Internal Server Error" })
  }

}
export const createUser = async(req, res)=>{
  try {
    const admin = req.user;
    const {name, email, password, role,  permissions} = req.body;
    const allowedRoles = ["Teacher", "Staff", "Student"];
    if(!allowedRoles.includes(role)){
      return res.status(403).json({message: "You Cannot Create this role"})
    }

    const invalidPermissions = permissions?.filter(
      p => !admin.permissions.includes(p)
    )
    if (invalidPermissions?.length) {
      return res.status(403).json({
        message: "Cannot assign permissions you don't have",
        invalidPermissions
      });
    }
     // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    
    // 3️⃣ Create and save new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role,
      permissions:permissions,
      accountId: admin.accountId
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        permissions: newUser.permissions,
        accountId: newUser.accountId

      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
// export const signup = async (req, res) => {
//   try {
//     const { name, email, password, role, permissions } = req.body;

//     // 1️⃣ Check all fields
//     if (!name || !email || !password || !role) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // 2️⃣ Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

    
//     // 3️⃣ Create and save new user
//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: role,
//       permissions:permissions
//     });
//     if (role === "Admin") {
//       newUser.accountId = newUser._id;
//       await newUser.save();
//     }

//     // 4️⃣ Send success response
//     res.status(201).json({
//       message: "Signup successful",
//       user: {
//         id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//         role: newUser.role,
//         permissions: newUser.permissions,
//         accountId: newUser.accountId

//       },
//     });
//   } catch (error) {
//     console.error("Signup Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User Not Found" })
    }

    res.status(200).json({
      message: "User Fetched SucessFully",
      user,
    })
  } catch (error) {
    console.error("Get User Details Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ sucess: false, message: "User Not found" });
    }

    res.status(200).json({ success: true, updatedUser });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export const getUsers = async (req, res) => {
  try {
    // const { role } = req.query;
    const query = req.user.role !== "SuperAdmin" ? { accountId: req.tenantAccountId } : {};
    const users = await User.find(query).select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};