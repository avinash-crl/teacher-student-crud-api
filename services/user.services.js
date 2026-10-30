const bcrypt = require("bcrypt");
const { User, ROLES } = require("../models/user.models");
const UserProfile = require("../models/userProfile.model");
const tokenService = require("../jwt/token.service");

const ACCOUNT_FIELDS = ["name", "email"];
const PROFILE_FIELDS = ["age", "dob", "bio"];

function pickAllowedFields(source, allowedFields) {
  const result = {};
  for (const field of allowedFields) {
    if (source[field] !== undefined) result[field] = source[field];
  }
  return result;
}

class UserService {
  async signup(data) {
    const { name, email, password, role, facultyCode } = data;

    if (!name || !email || !password) {
      throw new Error("Name, email and password are required");
    }
    if (typeof password !== "string" || password.length < 6) {
      throw new Error("Password must contain at least 6 characters");
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new Error("Please provide a valid email address");
    }

    let assignedRole = ROLES.STUDENT;
    if (role === ROLES.FACULTY) {
      if (!process.env.FACULTY_SIGNUP_CODE ||
          facultyCode !== process.env.FACULTY_SIGNUP_CODE) {
        throw new Error("Invalid faculty signup code");
      }
      assignedRole = ROLES.FACULTY;
    } else if (role !== undefined && role !== ROLES.STUDENT) {
      throw new Error("Invalid role. Use STUDENT or FACULTY");
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: assignedRole
      });

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      };
    } catch (error) {
      if (error.code === 11000) throw new Error("Email already exists");
      throw error;
    }
  }

  async loginUser(email, password) {
    if (!email || !password) throw new Error("Email and password are required");

    const user = await User.findOne({
      email: String(email).trim().toLowerCase()
    }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid email or password");
    }
    if (!user.isActive) throw new Error("Account is inactive");

    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };

    return {
      message: "Login successful",
      token: tokenService.generateToken(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    };
  }

  async getAllStudents() {
    return User.find({ role: ROLES.STUDENT, isActive: true })
      .select("-password")
      .populate("profile");
  }

  async getAllFaculty() {
    return User.find({ role: ROLES.FACULTY, isActive: true })
      .select("-password")
      .populate("profile");
  }

  async getMyAccount(userId) {
    const user = await User.findOne({ _id: userId, isActive: true })
      .select("-password")
      .populate("profile");
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateMyAccount(userId, data) {
    const updateData = pickAllowedFields(data, ACCOUNT_FIELDS);
    if (updateData.email !== undefined) {
      updateData.email = String(updateData.email).trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email)) {
        throw new Error("Please provide a valid email address");
      }
    }
    try {
      const user = await User.findOneAndUpdate(
        { _id: userId, isActive: true },
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-password");
      if (!user) throw new Error("User not found");
      return user;
    } catch (error) {
      if (error.code === 11000) throw new Error("Email already exists");
      throw error;
    }
  }

  async addMyProfile(userId, data) {
    const user = await User.findOne({ _id: userId, isActive: true });
    if (!user) throw new Error("User not found");
    if (user.profile) throw new Error("Profile already exists");

    const profileData = pickAllowedFields(data, PROFILE_FIELDS);
    const profile = await UserProfile.create({ user: userId, ...profileData });
    user.profile = profile._id;
    await user.save();
    return profile;
  }

  async updateMyProfile(userId, data) {
    const user = await User.findOne({ _id: userId, isActive: true });
    if (!user || !user.profile) throw new Error("Profile not found");

    const updateData = pickAllowedFields(data, PROFILE_FIELDS);
    return UserProfile.findByIdAndUpdate(
      user.profile,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  async updateStudent(studentId, data) {
    const updateData = pickAllowedFields(data, ACCOUNT_FIELDS);
    if (updateData.email !== undefined) {
      updateData.email = String(updateData.email).trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email)) {
        throw new Error("Please provide a valid email address");
      }
    }

    try {
      const student = await User.findOneAndUpdate(
        { _id: studentId, role: ROLES.STUDENT, isActive: true },
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-password");
      if (!student) throw new Error("Active student not found");
      return student;
    } catch (error) {
      if (error.code === 11000) throw new Error("Email already exists");
      throw error;
    }
  }

  async updateStudentProfile(studentId, data) {
    const student = await User.findOne({
      _id: studentId,
      role: ROLES.STUDENT,
      isActive: true
    });
    if (!student) throw new Error("Active student not found");
    if (!student.profile) throw new Error("Student profile not found");

    const updateData = pickAllowedFields(data, PROFILE_FIELDS);
    return UserProfile.findByIdAndUpdate(
      student.profile,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  async softDeleteStudent(studentId) {
    const student = await User.findOneAndUpdate(
      { _id: studentId, role: ROLES.STUDENT, isActive: true },
      { $set: { isActive: false } },
      { new: true }
    ).select("-password");

    if (!student) throw new Error("Active student not found");
    return student;
  }
}

module.exports = new UserService();
