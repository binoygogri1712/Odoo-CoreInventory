from pydantic import BaseModel, EmailStr, field_validator
import re


class RegisterRequest(BaseModel):
    login_id: str
    email: EmailStr
    password: str
    mobile: str
    gender: str

    @field_validator("login_id")
    @classmethod
    def validate_login_id(cls, v):
        if len(v) < 3 or len(v) > 50:
            raise ValueError("Login ID must be 3-50 characters")
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError("Login ID can only contain letters, numbers, and underscores")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r'[A-Z]', v):
            raise ValueError("Password must contain at least 1 uppercase letter")
        if not re.search(r'[a-z]', v):
            raise ValueError("Password must contain at least 1 lowercase letter")
        if not re.search(r'[0-9]', v):
            raise ValueError("Password must contain at least 1 number")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError("Password must contain at least 1 special character")
        return v

    @field_validator("mobile")
    @classmethod
    def validate_mobile(cls, v):
        if not re.match(r'^\+?[0-9]{10,15}$', v):
            raise ValueError("Invalid mobile number")
        return v

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, v):
        if v.lower() not in ["male", "female", "other"]:
            raise ValueError("Gender must be male, female, or other")
        return v.lower()


class LoginRequest(BaseModel):
    identifier: str  # Email or Login ID
    password: str


class OTPSendRequest(BaseModel):
    email: EmailStr


class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp_code: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class MessageResponse(BaseModel):
    message: str
    success: bool = True


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r'[A-Z]', v):
            raise ValueError("Password must contain at least 1 uppercase letter")
        if not re.search(r'[a-z]', v):
            raise ValueError("Password must contain at least 1 lowercase letter")
        if not re.search(r'[0-9]', v):
            raise ValueError("Password must contain at least 1 number")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError("Password must contain at least 1 special character")
        return v
