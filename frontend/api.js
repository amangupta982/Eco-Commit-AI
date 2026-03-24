// =========================================================
//  EcoCommit AI — Centralized API Service
//  All backend communication flows through this module.
// =========================================================

const API_BASE = "http://localhost:8000";

// ---------------------------------------------------------
//  Token helpers (JWT stored in localStorage)
// ---------------------------------------------------------

function getToken() {
    return localStorage.getItem("eco_token");
}

function setToken(token) {
    localStorage.setItem("eco_token", token);
}

function removeToken() {
    localStorage.removeItem("eco_token");
}

function isLoggedIn() {
    return !!getToken();
}

// ---------------------------------------------------------
//  Auth headers
// ---------------------------------------------------------

function authHeaders() {
    const token = getToken();
    return token ? { "Authorization": "Bearer " + token } : {};
}

// ---------------------------------------------------------
//  Generic API wrappers
// ---------------------------------------------------------

/**
 * GET request with JWT auth header.
 * Returns parsed JSON or throws an error object.
 */
async function apiGet(path) {
    const response = await fetch(API_BASE + path, {
        method: "GET",
        headers: authHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
        throw { status: response.status, detail: data.detail || "Request failed" };
    }

    return data;
}

/**
 * POST request with JSON body + JWT auth header.
 * Returns parsed JSON or throws an error object.
 */
async function apiPost(path, body) {
    const response = await fetch(API_BASE + path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders()
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
        throw { status: response.status, detail: data.detail || "Request failed" };
    }

    return data;
}

// ---------------------------------------------------------
//  AUTH endpoints
// ---------------------------------------------------------

/**
 * Register a new user.
 * POST /auth/register  — JSON body
 */
async function registerUser({ name, email, password, campus, city, state, country }) {
    return apiPost("/auth/register", {
        name, email, password, campus, city, state, country
    });
}

/**
 * Login user.
 * POST /auth/login  — form-encoded (OAuth2PasswordRequestForm)
 *
 * NOTE: FastAPI expects field name "username" (not "email")
 * and content-type "application/x-www-form-urlencoded".
 */
async function loginUser(email, password) {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await fetch(API_BASE + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString()
    });

    const data = await response.json();

    if (!response.ok) {
        throw { status: response.status, detail: data.detail || "Login failed" };
    }

    return data; // { access_token, token_type }
}

/**
 * Get current authenticated user's profile.
 * GET /auth/me
 */
async function fetchCurrentUser() {
    return apiGet("/auth/me");
}

// ---------------------------------------------------------
//  DASHBOARD endpoints
// ---------------------------------------------------------

async function fetchDashboardSummary() {
    return apiGet("/dashboard/summary");
}

async function fetchWeeklyData() {
    return apiGet("/dashboard/weekly");
}

async function fetchMonthlyData() {
    return apiGet("/dashboard/monthly");
}

async function fetchDistribution() {
    return apiGet("/dashboard/distribution");
}

async function fetchSimulation(users) {
    return apiGet("/dashboard/simulate?users=" + users);
}

// ---------------------------------------------------------
//  ACTIVITY endpoints
// ---------------------------------------------------------

async function addActivity(activityType, description) {
    return apiPost("/activity/add", {
        activity_type: activityType,
        description: description || ""
    });
}

// ---------------------------------------------------------
//  LEADERBOARD endpoints
// ---------------------------------------------------------

async function fetchLeaderboard(level, value) {
    return apiGet("/leaderboard/?level=" + encodeURIComponent(level) + "&value=" + encodeURIComponent(value));
}

// ---------------------------------------------------------
//  AI endpoints
// ---------------------------------------------------------

async function fetchAIRecommendations() {
    return apiGet("/ai/recommendations");
}

async function fetchClimateScore() {
    return apiGet("/ai/climate-score");
}

// ---------------------------------------------------------
//  PLATFORM endpoints
// ---------------------------------------------------------

async function fetchPlatformImpact() {
    return apiGet("/platform/impact");
}

async function fetchCityImpact() {
    return apiGet("/platform/impact-by-city");
}

async function fetchGlobalImpact() {
    return apiGet("/platform/global-impact");
}

// ---------------------------------------------------------
//  Auth guard — redirect to login if not authenticated
// ---------------------------------------------------------

function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = "login.html";
        return false;
    }
    return true;
}
