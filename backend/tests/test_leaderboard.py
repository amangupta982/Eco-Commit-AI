"""
Integration tests for leaderboard routes.
Tests: GET /leaderboard/
"""


class TestLeaderboard:

    def test_leaderboard_by_city(self, client):
        """Leaderboard is a public endpoint."""
        response = client.get("/leaderboard/?level=city&value=TestCity")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_leaderboard_by_country(self, client):
        response = client.get("/leaderboard/?level=country&value=TestCountry")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_leaderboard_by_campus(self, client):
        response = client.get("/leaderboard/?level=campus&value=TestCampus")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_leaderboard_by_state(self, client):
        response = client.get("/leaderboard/?level=state&value=TestState")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_leaderboard_global(self, client):
        response = client.get("/leaderboard/?level=global&value=all")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_leaderboard_missing_params(self, client):
        response = client.get("/leaderboard/")
        assert response.status_code == 422

    def test_leaderboard_entry_shape(self, client):
        """If there are entries, verify the response shape."""
        response = client.get("/leaderboard/?level=country&value=TestCountry")
        data = response.json()
        if len(data) > 0:
            entry = data[0]
            assert "rank" in entry
            assert "name" in entry
            assert "eco_points" in entry
            assert "carbon_saved" in entry
            assert "city" in entry
