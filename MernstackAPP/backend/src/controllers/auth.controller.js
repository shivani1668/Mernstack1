export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS.replace(/\s/g, ""), // Automatically removes spaces just in case
      },
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset Request - Chatty",
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset for your Chatty account.</p>
        <p>Please click the link below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="background: #4F46E5; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Reset Password</a>
        <br/><br/>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset email sent successfully" });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Could not send email. Please try again later." });
  }
};
