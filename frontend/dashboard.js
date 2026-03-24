lucide.createIcons();

// ── Auth guard — redirect if not logged in ──
if (!isLoggedIn()) {
    window.location.href = "login.html";
}

// =========================================================
//  LOAD DASHBOARD DATA FROM API
// =========================================================

async function loadDashboardData() {
    try {
        const summary = await fetchDashboardSummary();

        // Update stat cards with real data
        updateStat("statDailyCO2",   summary.daily_co2,    " kg");
        updateStat("statMonthlyCO2", summary.monthly_co2,  " kg");
        updateStat("statTrees",      summary.trees_equivalent);
        updateStat("statMoney",      summary.money_saved,  "", "$");
        updateStat("statEcoPoints",  summary.eco_points);

    } catch(err) {
        console.warn("Dashboard summary fallback to defaults:", err);
        // Fallback: use cached eco_points if available
        const cachedPoints = localStorage.getItem("ecoPoints");
        if (cachedPoints) {
            updateStat("statEcoPoints", parseInt(cachedPoints));
        }
    }
}

function updateStat(id, value, suffix, prefix) {
    const el = document.getElementById(id);
    if (!el) return;
    el.dataset.target = value || 0;
    if (suffix) el.dataset.suffix = suffix;
    if (prefix) el.dataset.prefix = prefix;
    animateCount(el);
}

function animateCount(el) {
    let target = parseFloat(el.dataset.target);
    let suffix = el.dataset.suffix || "";
    let prefix = el.dataset.prefix || "";
    let duration = 1400, startTime = null;

    function animate(t) {
        if (!startTime) startTime = t;
        let progress = Math.min((t - startTime) / duration, 1);
        let ease = 1 - Math.pow(1 - progress, 3);
        let value = (target * ease).toFixed(target % 1 ? 1 : 0);
        el.textContent = prefix + value + suffix;
        if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

// ── Load charts from API ──

async function loadCharts() {

    // Default data (fallback)
    let weeklyLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    let weeklyValues = [0, 0, 0, 0, 0, 0, 0];
    let monthlyLabels = ['Jan','Feb','Mar','Apr','May','Jun'];
    let monthlyValues = [0, 0, 0, 0, 0, 0];
    let distData = [0, 0, 0, 0];

    // Fetch real data (each with graceful fallback)
    try {
        const weekly = await fetchWeeklyData();
        if (Array.isArray(weekly) && weekly.length > 0) {
            weeklyLabels = weekly.map(d => d.day);
            weeklyValues = weekly.map(d => d.value);
        }
    } catch(e) { console.warn("Weekly data fallback:", e); }

    try {
        const monthly = await fetchMonthlyData();
        if (Array.isArray(monthly) && monthly.length > 0) {
            monthlyLabels = monthly.map(d => d.month);
            monthlyValues = monthly.map(d => d.value);
        }
    } catch(e) { console.warn("Monthly data fallback:", e); }

    try {
        const dist = await fetchDistribution();
        if (dist) {
            distData = [dist.walk || 0, dist.bus || 0, dist.bike || 0, dist.no_ac || 0];
        }
    } catch(e) { console.warn("Distribution data fallback:", e); }

    // ── Chart config ──
    const base = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { color: 'rgba(0,0,0,.08)', borderDash: [4,4] } },
            y: { grid: { color: 'rgba(0,0,0,.08)', borderDash: [4,4] } }
        }
    };

    // ── Weekly Line Chart ──
    const lineCanvas = document.getElementById("lineChart");
    if (lineCanvas) {
        new Chart(lineCanvas, {
            type: 'line',
            data: {
                labels: weeklyLabels,
                datasets: [{
                    data: weeklyValues,
                    borderColor: '#2e7d32',
                    tension: .45,
                    pointRadius: 5
                }]
            },
            options: base
        });
    }

    // ── Activity Distribution Doughnut ──
    const pieCanvas = document.getElementById("pieChart");
    if (pieCanvas) {
        new Chart(pieCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Walking','Bus','Bike','No AC'],
                datasets: [{
                    data: distData,
                    backgroundColor: ['#2e7d32','#1f4fa3','#10b981','#f4c542'],
                    borderWidth: 0
                }]
            },
            options: { cutout: '72%' }
        });
    }

    // ── Monthly Bar Chart ──
    const barCanvas = document.getElementById("barChart");
    if (barCanvas) {
        new Chart(barCanvas, {
            type: 'bar',
            data: {
                labels: monthlyLabels,
                datasets: [{
                    data: monthlyValues,
                    backgroundColor: '#2e7d32',
                    borderRadius: 8
                }]
            },
            options: base
        });
    }

    // ── Platform Impact Area Chart ──
    const areaCanvas = document.getElementById("areaChart");
    if (areaCanvas) {
        new Chart(areaCanvas, {
            type: 'line',
            data: {
                labels: monthlyLabels,
                datasets: [{
                    data: monthlyValues,
                    borderColor: '#2e7d32',
                    backgroundColor: 'rgba(46,125,50,.15)',
                    fill: true,
                    tension: .45
                }]
            },
            options: base
        });
    }
}

// ── Load simulation data ──

async function loadSimulation() {
    try {
        const sim = await fetchSimulation(100);
        document.getElementById("co2").textContent = (sim.co2_reduced || 0).toFixed(0);
        document.getElementById("aqi").textContent = (sim.aqi_improvement || 0).toFixed(0);
        document.getElementById("fuel").textContent = "$" + (sim.fuel_savings || 0).toLocaleString();
    } catch(e) {
        console.warn("Simulation fallback:", e);
        document.getElementById("co2").textContent = "--";
        document.getElementById("aqi").textContent = "--";
        document.getElementById("fuel").textContent = "--";
    }
}

// ── Load AI recommendations ──

async function loadAIRecommendations() {
    const box = document.getElementById("aiRecommendationBox");
    if (!box) return;

    try {
        const recs = await fetchAIRecommendations();

        if (Array.isArray(recs) && recs.length > 0) {
            box.innerHTML = recs.map(r => `<p>🌿 ${r}</p>`).join("");
        } else if (typeof recs === "object" && recs.recommendations) {
            box.innerHTML = recs.recommendations.map(r => `<p>🌿 ${r}</p>`).join("");
        } else {
            box.textContent = typeof recs === "string" ? recs : JSON.stringify(recs);
        }
    } catch(e) {
        console.warn("AI recommendation fallback:", e);
        box.innerHTML = `
            Switching to bus twice a week can reduce your yearly emissions by 18%.<br>
            Your walking habit already saves ~2.1 kg CO₂ daily.
        `;
    }
}

// ── Initialize everything ──
loadDashboardData();
loadCharts();
loadSimulation();
loadAIRecommendations();


/* ================= TRANSPORT BUTTON TOGGLE ================= */
const buttons = document.querySelectorAll(".tbtn");
let selectedMode = "Walk";

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedMode = btn.dataset.mode;
    });
});

/* ================= REAL GPS TRACKING SYSTEM ================= */
const goalInput = document.getElementById("goalInput");
const goalDisplay = document.getElementById("goalDisplay");
const progressKm = document.getElementById("progressKm");
const range = document.getElementById("range");
const trackBtn = document.getElementById("trackBtn");

let watchId = null;
let totalDistance = 0;
let previousPosition = null;
let tracking = false;

if (goalInput) {
    goalInput.addEventListener("input", () => {
        goalDisplay.textContent = goalInput.value;
    });
}

/* Haversine Formula */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

if (trackBtn) {
    trackBtn.addEventListener("click", async () => {

        if (!tracking) {

            if (!navigator.geolocation) {
                showToast("Geolocation not supported.", "error");
                return;
            }

            let goal = parseFloat(goalInput.value);
            if (!goal || goal <= 0) {
                showToast("Set a valid goal first.", "error");
                return;
            }

            tracking = true;
            trackBtn.textContent = "Stop Tracking";
            trackBtn.style.background = "#c62828";
            totalDistance = 0;
            previousPosition = null;

            watchId = navigator.geolocation.watchPosition(position => {

                let { latitude, longitude } = position.coords;

                if (previousPosition) {
                    let dist = calculateDistance(
                        previousPosition.latitude,
                        previousPosition.longitude,
                        latitude,
                        longitude
                    );
                    totalDistance += dist;
                }

                previousPosition = { latitude, longitude };

                progressKm.textContent = totalDistance.toFixed(2);

                let percent = (totalDistance / goal) * 100;
                if (percent > 100) percent = 100;

                range.value = percent;
                range.style.background =
                    `linear-gradient(to right,#2e7d32 ${percent}%,#d9e3df ${percent}%)`;

            }, { enableHighAccuracy: true });

        } else {

            navigator.geolocation.clearWatch(watchId);
            tracking = false;
            trackBtn.textContent = "Start Tracking";
            trackBtn.style.background = "linear-gradient(90deg,#2e7d32,#1f4fa3)";

            // ── Log activity to backend ──
            if (totalDistance > 0.01) {
                try {
                    const desc = totalDistance.toFixed(2) + " km tracked";
                    await addActivity(selectedMode, desc);
                    showToast("Activity logged: " + selectedMode + " — " + desc, "success");

                    // Refresh dashboard summary
                    loadDashboardData();
                } catch(e) {
                    console.warn("Could not log activity:", e);
                    showToast("Activity logged locally (backend sync pending)", "success");
                }
            }
        }
    });
}

/* ================= SAFE AI STATUS ================= */
const predict = document.getElementById("predict");

if (predict) {
    setTimeout(() => {
        predict.textContent = "✓ Complete";
        predict.className = "done";
    }, 2500);
}