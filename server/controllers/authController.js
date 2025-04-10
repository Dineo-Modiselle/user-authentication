import dotenv from "dotenv";
dotenv.config();
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";


export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // Send verification email
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Account Verification",
        text: `Welcome to our website, ${name}!Your account has been created with email id: ${email}. `
    }
await transporter.sendMail(mailOptions)

    return res.json({success: true});
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({success: true});

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token",
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
        return res.json({ success: true, message: "Logged out successfully" });
    
} catch (error) {
        res.json({ success: false, message: error.message });
    }
    }
export const sendVerifyOtp = async (req, res) => {
try {
  const {userId} = req.body;
  const user = await userModel.findById(userId);
  if (user.isAccountVerified) {
    return res.status(400).json({ message: "Account already verified" });
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.verifyOtp = otp;
  user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;//one day
   await user.save();
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: "Account Verification OTP",
    text: `Your OTP for account verification is ${otp}.`
} 
await transporter.sendMail(mailOptions);
  return res.json({ success: true, message: "OTP sent to your email" });

} catch (error) {
    res.json({ success: false, message: error.message });
  }
  
}

export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({ message: "Missing details" });
  }
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();
    return res.json({ success: true, message: "Account verified successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
    
  }


}

export const isAuthenticated = async (req, res) => {
try {
  return res.json({ success: true });
} catch (error) {
    res.json({ success: false, message: error.message });
    
  }
  
}



