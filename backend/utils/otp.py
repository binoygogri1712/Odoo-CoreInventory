import os
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_EMAIL = os.getenv("SMTP_EMAIL", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")


def generate_otp() -> str:
    return str(random.randint(100000, 999999))


def send_otp_email(to_email: str, otp_code: str) -> bool:
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "🔐 TraceFlow — Email Verification OTP"
        msg["From"] = f"TraceFlow <{SMTP_EMAIL}>"
        msg["To"] = to_email

        html = f"""
        <html>
        <body style="font-family: 'Inter', Arial, sans-serif; background-color: #f3f4f8; padding: 40px;">
            <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="display: inline-block; width: 56px; height: 56px; border-radius: 14px; background: linear-gradient(135deg, #7c5cfc, #b085ff); color: #fff; font-size: 22px; font-weight: 800; line-height: 56px; letter-spacing: 1px;">TF</div>
                    <h1 style="font-size: 22px; color: #1a1d29; margin: 16px 0 4px;">TraceFlow</h1>
                    <p style="color: #6b7185; font-size: 14px; margin: 0;">Email Verification</p>
                </div>
                <p style="color: #1a1d29; font-size: 15px; line-height: 1.6;">
                    Use the following OTP to complete your registration. This code expires in <strong>10 minutes</strong>.
                </p>
                <div style="text-align: center; margin: 28px 0;">
                    <div style="display: inline-block; background: linear-gradient(135deg, #7c5cfc, #b085ff); color: #fff; font-size: 32px; font-weight: 800; letter-spacing: 10px; padding: 16px 36px; border-radius: 12px;">
                        {otp_code}
                    </div>
                </div>
                <p style="color: #9ca3b8; font-size: 13px; text-align: center;">
                    If you didn't request this, please ignore this email.
                </p>
            </div>
        </body>
        </html>
        """

        part = MIMEText(html, "html")
        msg.attach(part)

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_email, msg.as_string())

        return True
    except Exception as e:
        print(f"Failed to send OTP email: {e}")
        return False


def send_reset_password_email(to_email: str, reset_link: str) -> bool:
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "🔐 TraceFlow — Password Reset Request"
        msg["From"] = f"TraceFlow <{SMTP_EMAIL}>"
        msg["To"] = to_email

        html = f"""
        <html>
        <body style="font-family: 'Inter', Arial, sans-serif; background-color: #f3f4f8; padding: 40px;">
            <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="display: inline-block; width: 56px; height: 56px; border-radius: 14px; background: linear-gradient(135deg, #7c5cfc, #b085ff); color: #fff; font-size: 22px; font-weight: 800; line-height: 56px; letter-spacing: 1px;">TF</div>
                    <h1 style="font-size: 22px; color: #1a1d29; margin: 16px 0 4px;">TraceFlow</h1>
                    <p style="color: #6b7185; font-size: 14px; margin: 0;">Password Reset</p>
                </div>
                <p style="color: #1a1d29; font-size: 15px; line-height: 1.6;">
                    You recently requested to reset your password for your TraceFlow account. Click the button below to reset it.
                </p>
                <div style="text-align: center; margin: 28px 0;">
                    <a href="{reset_link}" style="display: inline-block; background: linear-gradient(135deg, #7c5cfc, #b085ff); color: #fff; text-decoration: none; font-size: 16px; font-weight: 600; padding: 14px 28px; border-radius: 8px;">
                        Reset Password
                    </a>
                </div>
                <p style="color: #6b7185; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                    If you did not request a password reset, please ignore this email or reply to let us know. This link is only valid for the next 15 minutes.
                </p>
            </div>
        </body>
        </html>
        """

        part = MIMEText(html, "html")
        msg.attach(part)

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_email, msg.as_string())

        return True
    except Exception as e:
        print(f"Failed to send reset password email: {e}")
        return False
