import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import AuthenticationService from "../services/AuthenticationService.js";

class UserService {
  // Check if a user exists by username or email
  async checkIfUserExists(username, email) {
    return UserModel.findOne({
      isActive: true,
      $or: [{ username }, { email }]
    });
  }

  // Create a new user
  async createUser(userData, hashedPassword) {
    const userKey = uuidv4();
    const newUser = new UserModel({
      ...userData,
      password: hashedPassword,
      userKey,
      isActive: true,
      role: ["student"]
    });

    const savedUser = await newUser.save();
    return { user: savedUser };
  }

  async isSuperAdminUser(userKey) {
    const user = await UserModel.findOne({ userKey, isActive: true });

    if (user && user.role.includes("super_admin")) {
      return true;
    } else {
      throw new Error("You don't have super admin role!");
    }
  }

  async findUserByUserKeyWithSuperAdmin(userKey) {
    return UserModel.findOne({
      userKey,
      isActive: true
    });
  }

  async findUserByUserKey(userKey) {
    return UserModel.findOne({
      userKey,
      isActive: true,
      role: { $nin: ["super_admin"] } // Exclude super_admin users
    });
  }

  async updateUser(userKey, updateFields) {
    if (updateFields.password) {
      updateFields.password = await bcrypt.hash(updateFields.password, 10);
    }

    return UserModel.findOneAndUpdate(
      { userKey, isActive: true },
      updateFields,
      { new: true }
    );
  }

  // Deactivate a user (soft delete)
  async deactivateUser(userKey) {
    return UserModel.findOneAndUpdate(
      { userKey, isActive: true },
      { isActive: false },
      { new: true }
    );
  }

  async getAllUsers() {
    return UserModel.find({
      isActive: true,
      role: { $nin: ["super_admin"] }
    }).select("userKey username email role avatar rooms");
  }

  // Authenticate user (login)
  async findUserByUserNameAndPassword(username, password) {
    const user = await UserModel.findOne({ username, isActive: true });
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    return { user };
  }

  async refreshAccessToken(refreshToken) {
    return AuthenticationService.verifyRefreshToken(refreshToken);
  }
}

export default new UserService();
