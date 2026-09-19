import { authService } from "../services/authService.js";
import { config } from "../config/env.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const result = await authService.registerUser({ name, email, password, phone });

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      clientId: result.clientId,
      username: result.username,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, csrfToken, user } = await authService.loginUser({ email, password });

    const isProd = config.isProd;

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("csrf_token", csrfToken, {
      httpOnly: false,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      userId: user.userId,
      name: user.name,
      username: user.username,
      csrfToken,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  const isProd = config.isProd;
  res.clearCookie("token", { path: "/", httpOnly: true, secure: isProd, sameSite: "lax" });
  res.clearCookie("csrf_token", { path: "/", httpOnly: false, secure: isProd, sameSite: "lax" });
  res.json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);

    // Always respond with success to prevent email enumeration
    res.json({
      success: true,
      message:
        "If that email exists in our system, recovery instructions have been dispatched.",
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword({ token, newPassword });

    res.json({
      success: true,
      message:
        "Password reset successful. You may now log in with your new password.",
    });
  } catch (err) {
    next(err);
  }
};
