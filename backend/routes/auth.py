from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import User, OTPRecord
from schemas import (
    RegisterRequest,
    LoginRequest,
    OTPSendRequest,
    OTPVerifyRequest,
    TokenResponse,
    MessageResponse,
)
from utils.hashing import hash_password, verify_password
from utils.jwt_handler import create_access_token
from utils.otp import generate_otp, send_otp_email

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# ─── REGISTER ──────────────────────────────────────────────
@router.post("/register", response_model=MessageResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    # Check if login_id already exists
    if db.query(User).filter(User.login_id == req.login_id).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Login ID already taken",
        )

    # Check if email already exists
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    # Create user
    user = User(
        login_id=req.login_id,
        email=req.email,
        password_hash=hash_password(req.password),
        mobile=req.mobile,
        gender=req.gender,
        is_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return MessageResponse(message="Registration successful. Please verify your email with OTP.")


# ─── SEND OTP ─────────────────────────────────────────────
@router.post("/send-otp", response_model=MessageResponse)
def send_otp(req: OTPSendRequest, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user found with this email",
        )

    # Invalidate previous OTPs
    db.query(OTPRecord).filter(
        OTPRecord.email == req.email,
        OTPRecord.is_used == False,
    ).update({"is_used": True})
    db.commit()

    # Generate and store new OTP
    otp_code = generate_otp()
    otp_record = OTPRecord(email=req.email, otp_code=otp_code)
    db.add(otp_record)
    db.commit()

    # Send email
    sent = send_otp_email(req.email, otp_code)
    if not sent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP email. Please try again.",
        )

    return MessageResponse(message="OTP sent to your email successfully.")


# ─── VERIFY OTP ───────────────────────────────────────────
@router.post("/verify-otp", response_model=MessageResponse)
def verify_otp(req: OTPVerifyRequest, db: Session = Depends(get_db)):
    # Find the most recent unused OTP for this email
    otp_record = (
        db.query(OTPRecord)
        .filter(
            OTPRecord.email == req.email,
            OTPRecord.otp_code == req.otp_code,
            OTPRecord.is_used == False,
        )
        .order_by(OTPRecord.created_at.desc())
        .first()
    )

    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP code",
        )

    # Check if OTP is expired (10 minutes)
    if datetime.utcnow() - otp_record.created_at > timedelta(minutes=10):
        otp_record.is_used = True
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired. Please request a new one.",
        )

    # Mark OTP as used
    otp_record.is_used = True

    # Mark user as verified
    user = db.query(User).filter(User.email == req.email).first()
    if user:
        user.is_verified = True

    db.commit()

    return MessageResponse(message="Email verified successfully!")


# ─── LOGIN ────────────────────────────────────────────────
@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    # Check if identifier is email or login_id
    if "@" in req.identifier:
        user = db.query(User).filter(User.email == req.identifier).first()
    else:
        user = db.query(User).filter(User.login_id == req.identifier).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    if not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in",
        )

    # Create JWT token
    token = create_access_token(
        data={"sub": str(user.id), "login_id": user.login_id, "email": user.email}
    )

    return TokenResponse(
        access_token=token,
        user={
            "id": str(user.id),
            "login_id": user.login_id,
            "email": user.email,
            "mobile": user.mobile,
            "gender": user.gender,
        },
    )


# ─── CHECK AVAILABILITY ──────────────────────────────────
@router.get("/check-login-id/{login_id}")
def check_login_id(login_id: str, db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.login_id == login_id).first() is not None
    return {"available": not exists}


@router.get("/check-email/{email}")
def check_email(email: str, db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.email == email).first() is not None
    return {"available": not exists}
