const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email templates
const emailTemplates = {
  welcome: (name, email, tempPassword) => ({
    subject: 'Welcome to Employee Management System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Our Company!</h2>
        <p>Dear ${name},</p>
        <p>Welcome to our Employee Management System. Your account has been created successfully.</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Your Login Credentials:</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        </div>
        <p style="color: #e74c3c;"><strong>Important:</strong> Please change your password after first login.</p>
        <p>Best regards,<br>HR Team</p>
      </div>
    `
  }),

  leaveStatusUpdate: (name, leaveType, status, startDate, endDate, reason) => ({
    subject: `Leave Request ${status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${status === 'Approved' ? '#27ae60' : '#e74c3c'};">Leave Request ${status}</h2>
        <p>Dear ${name},</p>
        <p>Your leave request has been <strong>${status.toLowerCase()}</strong>.</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Leave Details:</h3>
          <p><strong>Type:</strong> ${leaveType}</p>
          <p><strong>Start Date:</strong> ${new Date(startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> ${new Date(endDate).toLocaleDateString()}</p>
          <p><strong>Reason:</strong> ${reason}</p>
        </div>
        <p>Best regards,<br>HR Team</p>
      </div>
    `
  }),

  passwordReset: (name, resetLink) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Dear ${name},</p>
        <p>You have requested to reset your password. Click the link below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </div>
        <p style="color: #e74c3c;">This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>HR Team</p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    const emailContent = emailTemplates[template](...data);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };