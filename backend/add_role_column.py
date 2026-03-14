"""
Quick migration: add 'role' column to users table.
Run once: python add_role_column.py
"""
from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(10) NOT NULL DEFAULT 'staff'"))
        conn.commit()
        print("SUCCESS: 'role' column added to users table.")
    except Exception as e:
        if "already exists" in str(e).lower() or "duplicate column" in str(e).lower():
            print("INFO: 'role' column already exists, skipping.")
        else:
            print(f"ERROR: {e}")
