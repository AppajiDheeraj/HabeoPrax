import nodemailer from 'nodemailer';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { Usermodel } from './db/schema.js';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Utility to send email
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: `"HabeoPrax" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`✅ Email sent to ${to}: ${subject}`);
  } catch (err) {
    console.error("❌ Email failed:", err);
  }
};

// Welcome Email Template
export const welcomeEmailHTML = (user) => `
  <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #f3f0ff; padding: 20px; border-radius: 10px; color: #333;">
    <div style="background: linear-gradient(to right, #9b5de5, #6a4c93); border-radius: 10px 10px 0 0; color: white; padding: 30px 20px; text-align: center;">
      <h2>Welcome to Your Journey!</h2>
      <p>We're excited to help you build lasting habits and achieve your goals, ${user.name}!</p>
    </div>
  
    <div style="background-color: #fff; border-radius: 8px; padding: 20px; margin-top: -20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="background-color: #e6e0ff; width: 60px; height: 60px; margin: auto; border-radius: 50%;">
          <img src="https://cdn-icons-png.flaticon.com/512/747/747376.png" width="30" style="margin-top: 15px;" />
        </div>
      </div>
      
      <h3 style="text-align: center;">Your Path to Success</h3>
      <ol style="padding-left: 20px; font-size: 15px; color: #555;">
        <li>Set up your first habit goal</li>
        <li>Track your daily progress</li>
        <li>Build your streak and celebrate wins</li>
      </ol>
    </div>
  
    <div style="margin-top: 20px;">
      <h4>💡 Suggested Habits to Start With</h4>
      <p>Morning meditation, daily journaling, 10-minute walks</p>
  
      <h4>🔑 Key Features</h4>
      <ul style="padding-left: 20px; font-size: 15px;">
        <li>Daily habit tracking</li>
        <li>Progress analytics</li>
        <li>Streak monitoring</li>
        <li>Community support</li>
      </ul>
    </div>
  
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://habeoprax.com" style="background-color: #9b5de5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px;">Get Started Now</a>
    </div>
  
    <p style="font-size: 12px; color: #999; text-align: center; margin-top: 40px;">
      You're receiving this email because you signed up for HabeoPrax.<br>
      You can unsubscribe at any time.
    </p>
  </div>
  `;

// Milestone Notification
const notifyMilestone = (user, milestone) => {
  sendEmail({
    to: user.email,
    subject: `🔥 Milestone Unlocked: ${milestone} Points!`,
    html: milestoneHTML(user, milestone),
  });
};

  const milestoneHTML = (user, milestone) => {
      return `
        <div style="max-width:500px;margin:auto;background:#f9f9f9;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,0.1);font-family:'Segoe UI', sans-serif;">
          <div style="background:#6f42c1;color:white;padding:24px 32px;border-radius:12px 12px 0 0;text-align:center">
            <h2 style="margin:0;font-size:24px;">🔥 Milestone Unlocked!</h2>
          </div>
          <div style="padding:30px;text-align:center">
            <h3 style="margin:0 0 10px 0;">Hey ${user.username},</h3>
            <p style="font-size:18px;margin:0;">You've reached</p>
            <h1 style="margin:10px 0;font-size:38px;color:#6f42c1">${milestone} Points 🎯</h1>
            <p style="font-size:16px;color:#444;margin-top:20px"> (+100 Points) </p>
            <p style="font-size:16px;color:#444;margin-top:20px">Keep shining and tracking those habits! 🚀</p>
          </div>
        </div>
      `;
    };
    

// Weekly Report Notification
const weeklyReportEmailHTML = (user, points) => `
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #f3f0ff; padding: 20px; border-radius: 10px; color: #333;">
      <div style="background: linear-gradient(to right, #9b5de5, #6a4c93); border-radius: 10px 10px 0 0; color: white; padding: 30px 20px; text-align: center;">
        <h2>Your Weekly Report 📊</h2>
        <p>Hey ${user.name}, here’s how you’re doing this week!</p>
      </div>
  
      <div style="background-color: #fff; border-radius: 8px; padding: 30px 20px; margin-top: -20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" width="60" style="border-radius: 50%;" alt="User Icon"/>
        </div>
  
        <h3 style="text-align: center;">👏 Great Job, ${user.name}!</h3>
        <p style="font-size: 16px; color: #555; text-align: center;">You've earned <strong>${points} points</strong> this week. Keep up the amazing consistency!</p>
      </div>
  
      <div style="margin-top: 30px;">
        <h4>📈 Highlights</h4>
        <ul style="padding-left: 20px; font-size: 15px; color: #555;">
          <li>🔥 Streak continues strong</li>
          <li>📅 Daily check-ins on point</li>
          <li>✅ Goals are getting crushed</li>
        </ul>
      </div>
  
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://habeoprax.com" style="background-color: #9b5de5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px;">Open App</a>
      </div>
  
      <p style="font-size: 12px; color: #999; text-align: center; margin-top: 40px;">
        You're receiving this email because you're part of HabeoPrax.<br>
        You can unsubscribe anytime.
      </p>
    </div>
  `;

// Schedule Weekly Report Emails
cron.schedule("0 0 * * 0", async () => {
  const users = await Usermodel.find();
  users.forEach(user => {
    sendEmail({
      to: user.email,
      subject: "📊 Your Weekly Report",
      html: weeklyReportEmailHTML(user, user.points)
    });
  });
});

// Add Points and Trigger Milestone Notifications
export const addPoints = async (email, addedPoints) => {
  const user = await Usermodel.findOne({ email });
  if (!user) return;

  const oldPoints = user.points;
  user.points += addedPoints;
  await user.save();

  const oldMilestone = Math.floor(oldPoints / 100);
  const newMilestone = Math.floor(user.points / 100);

  if (newMilestone > oldMilestone) {
    for (let m = oldMilestone + 1; m <= newMilestone; m++) {
      notifyMilestone(user, m * 100);
    }
  }
};