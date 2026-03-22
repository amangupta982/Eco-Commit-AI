"""
Integration tests for platform routes.
Tests: GET /platform/impact, /platform/impact-by-city, /platform/global-impact
"""


class TestPlatformImpact:

    def test_platform_impact(self, client):
        """Platform impact is a public endpoint."""
        response = client.get("/platform/impact")
        assert response.status_code == 200
        data = response.json()
        assert "total_users" in data
        assert "total_activities" in data
        assert "total_co2_saved" in data
        assert "trees_equivalent" in data
        assert "total_eco_points" in data

    def test_platform_impact_types(self, client):
        response = client.get("/platform/impact")
        data = response.json()
        assert isinstance(data["total_users"], int)
        assert isinstance(data["total_co2_saved"], (int, float))


class TestCityImpact:

    def test_city_impact(self, client):
        response = client.get("/platform/impact-by-city")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_city_impact_entry_shape(self, client):
        response = client.get("/platform/impact-by-city")
        data = response.json()
        if len(data) > 0:
            entry = data[0]
            assert "city" in entry
            assert "co2_saved" in entry


class TestGlobalImpact:

    def test_global_impact(self, client):
        response = client.get("/platform/global-impact")
        assert response.status_code == 200
        data = response.json()
        assert "total_users" in data
        assert "total_activities" in data
        assert "total_co2_saved" in data
        assert "trees_equivalent" in data
        assert "fuel_money_saved" in data

    def test_global_impact_values(self, client):
        response = client.get("/platform/global-impact")
        data = response.json()
        assert data["total_users"] >= 0
        assert data["total_co2_saved"] >= 0
