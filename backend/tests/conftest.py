"""
Shared test configuration for EcoCommit AI backend.

Uses SQLite in-memory database instead of PostgreSQL so tests
can run in CI without any external services.
"""

import os
import sys
import pytest

# ── Ensure backend/ is on sys.path ──
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

# ── Override DATABASE_URL BEFORE importing app modules ──
os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ["SECRET_KEY"] = "test-secret-key-12345"

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from database import Base, get_db
from main import app

# ── SQLite test engine ──
SQLALCHEMY_TEST_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_TEST_URL,
    connect_args={"check_same_thread": False}
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# ── Override the database dependency ──
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


# ─────────────────────────────────────
#  Fixtures
# ─────────────────────────────────────

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    """Create all tables once for the entire test session."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    # Clean up test.db file
    if os.path.exists("./test.db"):
        os.remove("./test.db")


@pytest.fixture(scope="module")
def client():
    """FastAPI TestClient for making HTTP requests."""
    return TestClient(app)


@pytest.fixture(scope="module")
def db_session():
    """Direct database session for setup/assertions."""
    session = TestingSessionLocal()
    yield session
    session.close()


@pytest.fixture(scope="module")
def auth_token(client):
    """
    Register + login a test user, return the JWT token.
    Reused across tests in each module.
    """
    import uuid
    unique = uuid.uuid4().hex[:8]

    # Register
    client.post("/auth/register", json={
        "name": f"TestUser_{unique}",
        "email": f"test_{unique}@eco.com",
        "password": "TestPass123",
        "campus": "Test Campus",
        "city": "TestCity",
        "state": "TestState",
        "country": "TestCountry"
    })

    # Login
    response = client.post("/auth/login", data={
        "username": f"test_{unique}@eco.com",
        "password": "TestPass123"
    })

    token = response.json()["access_token"]
    return token


@pytest.fixture(scope="module")
def auth_headers(auth_token):
    """Authorization headers with Bearer token."""
    return {"Authorization": f"Bearer {auth_token}"}
