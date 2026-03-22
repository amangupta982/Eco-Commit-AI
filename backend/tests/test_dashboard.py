"""
Integration tests for dashboard routes.
Tests: GET /dashboard/summary, /weekly, /monthly, /distribution, /simulate
"""


class TestDashboardSummary:

    def test_summary_authenticated(self, client, auth_headers):
        response = client.get("/dashboard/summary", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "daily_co2" in data
        assert "monthly_co2" in data
        assert "trees_equivalent" in data
        assert "money_saved" in data
        assert "eco_points" in data

    def test_summary_unauthorized(self, client):
        response = client.get("/dashboard/summary")
        assert response.status_code == 401

    def test_summary_values_are_numbers(self, client, auth_headers):
        response = client.get("/dashboard/summary", headers=auth_headers)
        data = response.json()
        assert isinstance(data["daily_co2"], (int, float))
        assert isinstance(data["monthly_co2"], (int, float))
        assert isinstance(data["eco_points"], (int, float))


class TestWeeklyData:

    def test_weekly_authenticated(self, client, auth_headers):
        response = client.get("/dashboard/weekly", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        # Should return list (may be empty for new user)
        assert isinstance(data, list)

    def test_weekly_unauthorized(self, client):
        response = client.get("/dashboard/weekly")
        assert response.status_code == 401


class TestMonthlyData:

    def test_monthly_authenticated(self, client, auth_headers):
        response = client.get("/dashboard/monthly", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_monthly_unauthorized(self, client):
        response = client.get("/dashboard/monthly")
        assert response.status_code == 401


class TestDistribution:

    def test_distribution_authenticated(self, client, auth_headers):
        response = client.get("/dashboard/distribution", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "walk" in data
        assert "bus" in data
        assert "bike" in data
        assert "car" in data
        assert "no_ac" in data

    def test_distribution_unauthorized(self, client):
        response = client.get("/dashboard/distribution")
        assert response.status_code == 401


class TestSimulate:

    def test_simulate_with_param(self, client):
        """Simulate endpoint is public (no auth required)."""
        response = client.get("/dashboard/simulate?users=100")
        assert response.status_code == 200
        data = response.json()
        assert data["co2_reduced"] == 2.4
        assert data["aqi_improvement"] == 0.3
        assert data["fuel_savings"] == 1200

    def test_simulate_zero(self, client):
        response = client.get("/dashboard/simulate?users=0")
        assert response.status_code == 200
        data = response.json()
        assert data["co2_reduced"] == 0

    def test_simulate_missing_param(self, client):
        """Missing 'users' query param should return 422."""
        response = client.get("/dashboard/simulate")
        assert response.status_code == 422
