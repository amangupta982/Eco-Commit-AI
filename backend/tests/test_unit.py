"""
Unit tests for pure functions and utilities.
No database or HTTP server needed.
"""

import os
import sys
import pytest
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")
os.environ.setdefault("SECRET_KEY", "ci-test-secret-key-12345")


# ─────────────────────────────────────
#  Carbon Calculator
# ─────────────────────────────────────

class TestCarbonCalculator:

    def test_walk_returns_known_values(self):
        from services.carbon_calculator import calculate_carbon
        carbon, points = calculate_carbon("walk")
        assert carbon == 1.0
        assert points == 10

    def test_public_transport(self):
        from services.carbon_calculator import calculate_carbon
        carbon, points = calculate_carbon("public transport")
        assert carbon == 2.5
        assert points == 25

    def test_planted_tree(self):
        from services.carbon_calculator import calculate_carbon
        carbon, points = calculate_carbon("planted tree")
        assert carbon == 10.0
        assert points == 100

    def test_avoided_ac(self):
        from services.carbon_calculator import calculate_carbon
        carbon, points = calculate_carbon("avoided ac")
        assert carbon == 3.0
        assert points == 30

    def test_carpool(self):
        from services.carbon_calculator import calculate_carbon
        carbon, points = calculate_carbon("carpool")
        assert carbon == 2.0
        assert points == 20

    def test_cycled(self):
        from services.carbon_calculator import calculate_carbon
        carbon, points = calculate_carbon("cycled")
        assert carbon == 1.8
        assert points == 18

    def test_unknown_activity_returns_default(self):
        from services.carbon_calculator import calculate_carbon
        carbon, points = calculate_carbon("skateboard")
        assert carbon == 0.5
        assert points == 5

    def test_case_insensitive(self):
        from services.carbon_calculator import calculate_carbon
        carbon1, _ = calculate_carbon("Walk")
        carbon2, _ = calculate_carbon("WALK")
        assert carbon1 == carbon2 == 1.0


# ─────────────────────────────────────
#  Simulation Service
# ─────────────────────────────────────

class TestSimulationService:

    def test_simulate_100_users(self):
        from services.simulation_service import simulate_future
        result = simulate_future(100)
        assert result["co2_reduced"] == pytest.approx(2.4)
        assert result["aqi_improvement"] == pytest.approx(0.3)
        assert result["fuel_savings"] == pytest.approx(1200)

    def test_simulate_zero_users(self):
        from services.simulation_service import simulate_future
        result = simulate_future(0)
        assert result["co2_reduced"] == 0
        assert result["aqi_improvement"] == 0
        assert result["fuel_savings"] == 0

    def test_simulate_one_user(self):
        from services.simulation_service import simulate_future
        result = simulate_future(1)
        assert result["co2_reduced"] == pytest.approx(0.02)
        assert result["fuel_savings"] == 12

    def test_simulate_large_scale(self):
        from services.simulation_service import simulate_future
        result = simulate_future(10000)
        assert result["co2_reduced"] == pytest.approx(240.0)
        assert result["fuel_savings"] == pytest.approx(120000)


# ─────────────────────────────────────
#  Password Hashing
# ─────────────────────────────────────

class TestPasswordHash:

    def test_hash_returns_string(self):
        from utils.password_hash import hash_password
        hashed = hash_password("mypassword")
        assert isinstance(hashed, str)
        assert len(hashed) > 0

    def test_hash_is_not_plaintext(self):
        from utils.password_hash import hash_password
        hashed = hash_password("mypassword")
        assert hashed != "mypassword"

    def test_verify_correct_password(self):
        from utils.password_hash import hash_password, verify_password
        hashed = hash_password("secret123")
        assert verify_password("secret123", hashed) is True

    def test_verify_wrong_password(self):
        from utils.password_hash import hash_password, verify_password
        hashed = hash_password("secret123")
        assert verify_password("wrong_password", hashed) is False

    def test_different_hashes_for_same_password(self):
        from utils.password_hash import hash_password
        h1 = hash_password("same")
        h2 = hash_password("same")
        # bcrypt salts differ, so hashes should differ
        assert h1 != h2


# ─────────────────────────────────────
#  JWT Handler
# ─────────────────────────────────────

class TestJWTHandler:

    def test_create_token_returns_string(self):
        from utils.jwt_handler import create_access_token
        token = create_access_token({"user_id": 1})
        assert isinstance(token, str)
        assert len(token) > 20

    def test_verify_valid_token(self):
        from utils.jwt_handler import create_access_token, verify_access_token
        token = create_access_token({"user_id": 42})
        payload = verify_access_token(token)
        assert payload is not None
        assert payload["user_id"] == 42

    def test_verify_invalid_token_returns_none(self):
        from utils.jwt_handler import verify_access_token
        result = verify_access_token("this.is.not.a.valid.token")
        assert result is None

    def test_verify_empty_token_returns_none(self):
        from utils.jwt_handler import verify_access_token
        result = verify_access_token("")
        assert result is None

    def test_token_contains_expiry(self):
        from utils.jwt_handler import create_access_token, verify_access_token
        token = create_access_token({"user_id": 1})
        payload = verify_access_token(token)
        assert "exp" in payload
