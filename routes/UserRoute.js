import express from "express";
import {
  createUser,
  updateUser,
  findUserByUserKey,
  allUsers,
  login,
  refreshToken,
  authMe,
  logout
} from "../controllers/UserController.js";

import authenticateToken from "../middleware/TokenValidation.js";
import { validateLoginUser } from "../middleware/validators/validateUser.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", validateLoginUser, login);
router.post("/refresh-token", refreshToken);
router.get("/me", authenticateToken, authMe);
router.post("/logout", logout);

router.get("/:userKey", authenticateToken, findUserByUserKey);
router.get("/", authenticateToken, allUsers);
router.put("/:userKey", authenticateToken, updateUser);

export default router;
