import UserService from "../services/UserService.js";
import AuthenticationService from "../services/AuthenticationService.js";
import { handleError } from "../middleware/ErrorHandler.js";

// **User Authentication**
export const authMe = async (req, res) => {
  const user = req.user;
  if (user) {
    return res.json({ user });
  } else {
    return res.status(401).json({ code: 401, message: "Not authenticated" });
  }
};

// Logout Endpoint
export const logout = (req, res) => {
  res
    .cookie("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0)
    })
    .json({ message: "Logged out successfully" });
};

export const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      try {
        const user = await UserService.findUserByUserKey(decoded.userKey);

        if (!user) {
          return res.status(403).json({ message: "User not found" });
        }

        // Generate new tokens
        const { accessToken, refreshToken } =
          AuthenticationService.generateTokens(user);

        // Send new tokens to client
        res
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
          })
          .json({ accessToken, refreshToken });
      } catch (error) {
        console.error("Refresh token error:", error);
        res.status(500).json({ message: "Server error" });
      }
    }
  );
};

// **Create User (Viewer by Default)**
export const createUser = async (req, res) => {
  const { password, ...userData } = req.body;

  try {
    const existingUser = await UserService.checkIfUserExists(
      userData.username,
      userData.email
    );

    if (existingUser) {
      return res
        .status(400)
        .json({ code: 400, message: "User already exists" });
    }

    // Moved password hashing to AuthenticationService
    const hashedPassword = await AuthenticationService.hashPassword(password);

    const avatarData = await AvatarService.getRandomAvatar(userData.gender);

    const { user } = await UserService.createUser(userData, hashedPassword);

    // Generate new tokens
    const { accessToken, refreshToken } =
      AuthenticationService.generateTokens(user);

    // Send new tokens to client
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .json({ accessToken, refreshToken, user });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res
        .status(400)
        .json({ code: 400, message: `Duplicate field: ${field}` });
    }
    handleError(res, err);
  }
};

// **Update User**
export const updateUser = async (req, res) => {
  const { userKey } = req.params;
  const updateFields = req.body;

  try {
    const updatedUser = await UserService.updateUser(userKey, updateFields);

    if (!updatedUser) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    return res.status(200).json({ updatedUser, message: "Profile Updated" });
  } catch (error) {
    handleError(res, error);
  }
};

// **Soft Delete User (Deactivate)**
export const deleteUser = async (req, res) => {
  const { userKey } = req.params;

  try {
    const user = await UserService.deactivateUser(userKey);

    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    return res.status(200).json({ message: "User is now inactive", user });
  } catch (error) {
    handleError(res, error);
  }
};

// **Find User by UserKey**
export const findUserByUserKey = async (req, res) => {
  const { userKey } = req.params;

  try {
    const user = await UserService.findUserByUserKey(userKey);

    if (!user) {
      return res.status(404).json({ code: 404, message: "No such User" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    handleError(res, error);
  }
};

// **Get All Users**
export const allUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    handleError(res, error);
  }
};

// **Authenticate User (Login)**
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user } = await UserService.findUserByUserNameAndPassword(
      email,
      password
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const { accessToken, refreshToken } =
      AuthenticationService.generateTokens(user);

    // Send tokens to client (set refreshToken in HTTP-only cookie)
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })
      .json({ accessToken, refreshToken, user }); // You can customize the user data sent back
  } catch (err) {
    handleError(res, err);
  }
};
