import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthenticationService {
  // Function to hash password
  async hashPassword(password) {
    return bcrypt.hash(password, 10); // 10 is the salt rounds
  }

  // Function to generate access and refresh tokens
  generateTokens = (user) => {
    const accessToken = jwt.sign(
      { username: user.username, id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" } // Access token expires in 15 minutes
    );

    const refreshToken = jwt.sign(
      { username: user.username, id: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" } // Refresh token expires in 7 days
    );

    return { accessToken, refreshToken };
  };

  // Verify refresh token and generate new access token
  async verifyRefreshToken(refreshToken) {
    try {
      const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      // Generate a new access token
      const newAccessToken = jwt.sign(
        { id: user.id, username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      return newAccessToken;
    } catch (err) {
      throw new Error("Refresh token is invalid: " + err.message);
    }
  }
}

export default new AuthenticationService();
