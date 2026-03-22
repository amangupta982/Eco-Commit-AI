"""
Integration tests for authentication routes.
Tests: POST /auth/register, POST /auth/login, GET /auth/me
"""

import uuid


# ─────────────────────────────────────
#  REGISTER
# ─────────────────────────────────────

class TestRegister:

    def test_register_success(self, client):
        uid = uuid.uuid4().hex[:8]
        response = client.post("/auth/register", json={
            "name": f"User_{uid}",
            "email": f"reg_{uid}@eco.com",
            "password": "Password123",
            "campus": "MIT",
            "city": "Boston",
            "state": "MA",
            "country": "USA"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == f"reg_{uid}@eco.com"
        assert data["name"] == f"User_{uid}"
        assert "id" in data
        assert data["eco_points"] == 0
        assert data["total_carbon_saved"] == 0

    def test_register_duplicate_email(self, client):
        uid = uuid.uuid4().hex[:8]
        email = f"dup_{uid}@eco.com"
        payload = {
            "name": "Dup User",
            "email": email,
            "password": "Password123",
            "campus": "IIT",
            "city": "Delhi",
            "state": "DL",
            "country": "India"
        }

        # First registration — should succeed
        r1 = client.post("/auth/register", json=payload)
        assert r1.status_code == 200

        # Second registration — should fail
        r2 = client.post("/auth/register", json=payload)
        assert r2.status_code == 400
        assert "already registered" in r2.json()["detail"].lower()

    def test_register_missing_fields(self, client):
        response = client.post("/auth/register", json={
            "name": "No Email",
            "password": "Password123"
        })
        assert response.status_code == 422  # Pydantic validation error

    def test_register_invalid_email(self, client):
        response = client.post("/auth/register", json={
            "name": "Bad Email",
            "email": "not-an-email",
            "password": "Password123",
            "campus": "Test",
            "city": "Test",
            "state": "Test",
            "country": "Test"
        })
        assert response.status_code == 422

    def test_register_returns_user_response_shape(self, client):
        uid = uuid.uuid4().hex[:8]
        response = client.post("/auth/register", json={
            "name": f"Shape_{uid}",
            "email": f"shape_{uid}@eco.com",
            "password": "Password123",
            "campus": "Campus",
            "city": "City",
            "state": "State",
            "country": "Country"
        })
        data = response.json()
        # Must match UserResponse schema
        assert "id" in data
        assert "name" in data
        assert "email" in data
        assert "campus" in data
        assert "city" in data
        assert "state" in data
        assert "country" in data
        assert "total_carbon_saved" in data
        assert "eco_points" in data
        # Password must NOT be in response
        assert "password" not in data


# ─────────────────────────────────────
#  LOGIN
# ─────────────────────────────────────

class TestLogin:

    def _create_user(self, client):
        uid = uuid.uuid4().hex[:8]
        email = f"login_{uid}@eco.com"
        client.post("/auth/register", json={
            "name": f"Login_{uid}",
            "email": email,
            "password": "LoginPass123",
            "campus": "Campus",
            "city": "City",
            "state": "State",
            "country": "Country"
        })
        return email

    def test_login_success(self, client):
        email = self._create_user(client)
        response = client.post("/auth/login", data={
            "username": email,
            "password": "LoginPass123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert len(data["access_token"]) > 20

    def test_login_wrong_password(self, client):
        email = self._create_user(client)
        response = client.post("/auth/login", data={
            "username": email,
            "password": "WrongPassword"
        })
        assert response.status_code == 400
        assert "invalid credentials" in response.json()["detail"].lower()

    def test_login_nonexistent_user(self, client):
        response = client.post("/auth/login", data={
            "username": "nouser@eco.com",
            "password": "NoPass123"
        })
        assert response.status_code == 400

    def test_login_uses_form_encoding(self, client):
        """Login endpoint expects form data, NOT JSON."""
        email = self._create_user(client)
        # Sending JSON should fail (422 or similar)
        response = client.post("/auth/login", json={
            "username": email,
            "password": "LoginPass123"
        })
        assert response.status_code == 422


# ─────────────────────────────────────
#  GET /auth/me
# ─────────────────────────────────────

class TestMe:

    def test_me_authenticated(self, client, auth_headers):
        response = client.get("/auth/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "name" in data
        assert "email" in data
        assert "eco_points" in data

    def test_me_without_token(self, client):
        response = client.get("/auth/me")
        assert response.status_code == 401

    def test_me_with_invalid_token(self, client):
        response = client.get("/auth/me", headers={
            "Authorization": "Bearer invalid.fake.token"
        })
        assert response.status_code == 401
