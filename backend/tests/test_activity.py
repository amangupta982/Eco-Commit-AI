"""
Integration tests for activity routes.
Tests: POST /activity/add
"""


class TestAddActivity:

    def test_add_activity_success(self, client, auth_headers):
        response = client.post("/activity/add", json={
            "activity_type": "walk",
            "description": "Morning walk 2km"
        }, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["activity_type"] == "walk"
        assert data["description"] == "Morning walk 2km"
        assert data["carbon_saved"] == 1.0
        assert data["eco_points_earned"] == 10
        assert "id" in data
        assert "created_at" in data

    def test_add_activity_without_description(self, client, auth_headers):
        response = client.post("/activity/add", json={
            "activity_type": "cycled"
        }, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["activity_type"] == "cycled"
        assert data["carbon_saved"] == 1.8

    def test_add_activity_unknown_type(self, client, auth_headers):
        response = client.post("/activity/add", json={
            "activity_type": "skateboard",
            "description": "Testing unknown"
        }, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        # Should use default carbon value
        assert data["carbon_saved"] == 0.5
        assert data["eco_points_earned"] == 5

    def test_add_activity_unauthorized(self, client):
        response = client.post("/activity/add", json={
            "activity_type": "walk"
        })
        assert response.status_code == 401

    def test_add_activity_missing_type(self, client, auth_headers):
        response = client.post("/activity/add", json={
            "description": "No type given"
        }, headers=auth_headers)
        assert response.status_code == 422

    def test_add_multiple_activities(self, client, auth_headers):
        """Adding several activities should all succeed."""
        types = ["walk", "public transport", "avoided ac"]
        for atype in types:
            r = client.post("/activity/add", json={
                "activity_type": atype
            }, headers=auth_headers)
            assert r.status_code == 200
            assert r.json()["activity_type"] == atype
