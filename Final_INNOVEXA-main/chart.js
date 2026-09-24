/* ================= PERFORMANCE CHART ================= */

// ========================================
// STUDENT DATA
// ========================================

const studentData = {
    overallPerformance: 10,
    subjectsEnrolled: 6,
    attendance: 62,
    studyHours: 5,
    aiRiskLevel: "High"
};

async function loadDashboardData() {
    if (!window.innovexaApi) return;
    try {
        const dashboard = await window.innovexaApi.request("/api/student/dashboard");
        const subjects = dashboard.subjects || [];
        const average = subjects.length
            ? Math.round(subjects.reduce((sum, subject) => sum + Number(subject.average_score || 0), 0) / subjects.length)
            : 0;
        studentData.overallPerformance = average;
        studentData.subjectsEnrolled = subjects.length;
        const attendanceValues = subjects
            .map((subject) => subject.attendance_pct)
            .filter((value) => value !== null && value !== undefined);
        studentData.attendance = attendanceValues.length
            ? Math.round(attendanceValues.reduce((sum, value) => sum + Number(value), 0) / attendanceValues.length)
            : 0;
        studentData.aiRiskLevel = subjects.some((subject) => subject.risk_level === "high")
            ? "High"
            : subjects.some((subject) => subject.risk_level === "medium") ? "Medium" : "Low";
        updateDashboardSummary();
    } catch (error) {
        console.error("Unable to load dashboard data:", error);
    }
}


// ========================================
// GET HTML ELEMENTS
// ========================================

const overallPerformanceValue =
    document.getElementById("overall-performance-value");

const overallPerformanceStatus =
    document.getElementById("overall-performance-status");

const enrolledSubjectValue =
    document.getElementById("enrolled-subject-value");

const attendanceValue =
    document.getElementById("attendance-value");

const attendanceStatus =
    document.getElementById("attendance-status");

const studyHoursValue =
    document.getElementById("study-hours-value");

const studyHoursStatus =
    document.getElementById("study-hours-status");

const aiRiskLevelValue =
    document.getElementById("ai-risk-level-value");

const aiRiskLevelStatus =
    document.getElementById("oveai-risk-level-status");


// ========================================
// INSERT DATA INTO HTML
// ========================================

function updateDashboardSummary() {
    if (overallPerformanceValue) overallPerformanceValue.textContent = studentData.overallPerformance + "%";
    if (overallPerformanceStatus) overallPerformanceStatus.textContent = getPerformanceStatus(studentData.overallPerformance);
    if (enrolledSubjectValue) enrolledSubjectValue.textContent = studentData.subjectsEnrolled;
    if (attendanceValue) attendanceValue.textContent = studentData.attendance + "%";
    if (attendanceStatus) attendanceStatus.textContent = getAttendanceStatus(studentData.attendance);
    if (studyHoursValue) studyHoursValue.textContent = studentData.studyHours + " hrs";
    if (studyHoursStatus) studyHoursStatus.textContent = "Today";
    if (aiRiskLevelValue) aiRiskLevelValue.textContent = studentData.aiRiskLevel;
    if (aiRiskLevelStatus) aiRiskLevelStatus.textContent = getRiskStatus(studentData.aiRiskLevel);
}

updateDashboardSummary();
loadDashboardData();


// ========================================
// PERFORMANCE STATUS
// ========================================

function getPerformanceStatus(performance) {

    if (performance >= 80) {
          overallPerformanceValue.style.color ="lightgreen";
        return "Excellent";
    }

    if (performance >= 60) {
          overallPerformanceValue.style.color ="#e6f55e";
        return "Good";
    }

    if (performance >= 40) {
          overallPerformanceValue.style.color ="orange";
        return "Average";
    }
         overallPerformanceValue.style.color ="red";
    return "Needs Improvement";
}


// ========================================
// ATTENDANCE STATUS
// ========================================

function getAttendanceStatus(attendance) {

    if (attendance >= 75) {
       attendanceValue.style.color ="lightgreen";
        return "Good";
    }

    if (attendance >= 60) {
        attendanceValue.style.color ="orange";
        return "Low";
    }
       attendanceValue.style.color ="red";
    return "Critical";
}


// ========================================
// AI RISK STATUS
// ========================================

function getRiskStatus(riskLevel) {

    if (riskLevel === "Low") {
        aiRiskLevelValue.style.color = "lightgreen";
        return "Keep it up";
    }

    if (riskLevel === "Medium") {
        aiRiskLevelValue.style.color = "orange";
        return "Keep Improving";
    }

    if (riskLevel === "High") {
        aiRiskLevelValue.style.color ="red";
        return "Needs Attention";
    }

    return "Unknown";
}


/* =========================================
   SUBJECT PERFORMANCE DATA
// ========================================= */
/* =====================================================
   TODAY SUBJECT-WISE PERFORMANCE DATA
===================================================== */

const todayPerformanceData = {
    date: "2026-09-13",
    subjects: [
        {
            id: 1,
            name: "Data Structures",
            shortName: "DSA",
            performance: 82,

            difficulty: {
                easy: 92,
                medium: 78,
                hard: 42
            }
        },
        {
            id: 2,
            name: "Operating System",
            shortName: "OS",
            performance: 74,

            difficulty: {
                easy: 86,
                medium: 65,
                hard: 48
            }
        },
        {
            id: 3,
            name: "OOPs with Java",
            shortName: "Java",
            performance: 86,

            difficulty: {
                easy: 94,
                medium: 82,
                hard: 68
            }
        },

        {
            id: 4,
            name: "Computer Networks",
            shortName: "CN",
            performance: 69,

            difficulty: {
                easy: 80,
                medium: 61,
                hard: 45
            }
        },

        {
            id: 5,
            name: "Artificial Intelligence",
            shortName: "AI",
            performance: 79,

            difficulty: {
                easy: 91,
                medium: 74,
                hard: 57
            }
        },

        {
            id: 6,
            name: "Mathematics",
            shortName: "Math",
            performance: 78,

            difficulty: {
                easy: 84,
                medium: 69,
                hard: 39
            }
        }

    ]

};


/* =====================================================
   SOFT SUBJECT COLORS
===================================================== */

const subjectColors = [

    "rgba(27, 71, 214, 0.7)",

    "rgba(18, 198, 57, 0.7)",

    "rgba(242, 200, 76, 0.7)",

    "rgba(155, 81, 224, 0.7)",

    "rgba(234, 48, 48, 0.7)",

    "rgba(0, 184, 217, 0.7)"

];


/* =====================================================
   DIFFICULTY COLORS
===================================================== */

const difficultyColors = {

    easy: "#42d66b",

    medium: "#e6bd42",

    hard: "#ef5b5b"

};


/* Soft remaining color */

const remainingColor =
    "rgba(255, 255, 255, 0.06)";


/* =====================================================
   MAIN PERFORMANCE CHART
===================================================== */

const subjectPerformanceCanvas =
    document.getElementById(
        "subjectPerformanceChart"
    );


let subjectPerformanceChart;


/* Create chart */

function createSubjectPerformanceChart() {

    const subjects =
        todayPerformanceData.subjects;


    /* Subject names */

    const labels =
        subjects.map(subject =>
            subject.shortName
        );


    /* Performance values */

    const values =
        subjects.map(subject =>
            subject.performance
        );


    /* Average */

    const total =
        values.reduce(
            (sum, value) => sum + value,
            0
        );


    const average =
        total / values.length;


    /* Average text */

    document.getElementById(
        "average-performance"
    ).textContent =
        `Average: ${Math.round(average)}%`;


    /* Subtitle */

    document.getElementById(
        "performance-subtitle"
    ).textContent =
        "Today's academic performance by subject";


    /* If chart already exists */

    if (subjectPerformanceChart) {

        subjectPerformanceChart.destroy();

    }


    /* Create Chart */

    subjectPerformanceChart =
        new Chart(

            subjectPerformanceCanvas,

            {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label: "Performance",

                            data: values,

                            backgroundColor:
                                subjectColors,

                            borderColor:
                                subjectColors,

                            borderWidth: 1,

                            borderRadius: 7,

                            borderSkipped: false

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    scales: {

                        y: {

                            beginAtZero: true,

                            max: 100,

                            ticks: {

                                color: "#8f96ad",

                                callback:
                                    function(value) {

                                        return value + "%";

                                    }

                            },

                            grid: {

                                color:
                                    "rgba(255,255,255,0.05)"

                            }

                        },


                        x: {

                            ticks: {

                                color: "#aeb4ca"

                            },

                            grid: {

                                display: false

                            }

                        }

                    },


                    plugins: {

                        legend: {

                            display: false

                        },


                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        return ` Performance: ${context.raw}%`;

                                    }

                            }

                        }

                    }

                }

            }

        );

}


/* =====================================================
   DIFFICULTY CHARTS
===================================================== */

const difficultyGrid =
    document.getElementById(
        "difficulty-chart-grid"
    );


const difficultyCharts = [];


/* Create all six charts */

function createDifficultyCharts() {

    /* Remove previous cards */

    difficultyGrid.innerHTML = "";


    /* Destroy old charts */

    difficultyCharts.forEach(
        chart => chart.destroy()
    );


    difficultyCharts.length = 0;


    /* Loop through subjects */

    todayPerformanceData.subjects.forEach(
        subject => {


            /* -----------------------------------------
               Find weakest difficulty
            ----------------------------------------- */

            const difficulty =
                subject.difficulty;


            const weakestDifficulty =
                Object.keys(difficulty)
                    .reduce(
                        (weakest, current) => {

                            return difficulty[current] <
                                difficulty[weakest]
                                ? current
                                : weakest;

                        }
                    );


            /* -----------------------------------------
               Create card
            ----------------------------------------- */

            const card =
                document.createElement("div");


            card.className =
                "difficulty-card";


            /* -----------------------------------------
               Card HTML
            ----------------------------------------- */

            card.innerHTML = `

                <div class="difficulty-card-header">

                    <h4>
                        ${subject.name}
                    </h4>

                    <span class="subject-overall-score">
                        ${subject.performance}%
                    </span>

                </div>


                <div class="difficulty-chart-wrapper">

                    <canvas
                        id="difficulty-chart-${subject.id}">
                    </canvas>

                </div>


                <div class="difficulty-legend">


                    <!-- EASY -->

                    <div class="difficulty-item">

                        <div class="difficulty-item-left">

                            <span
                                class="difficulty-dot"
                                style="
                                    background:
                                    ${difficultyColors.easy};
                                ">
                            </span>

                            <span
                                class="difficulty-name"
                                style="
                                    color:
                                    ${difficultyColors.easy};
                                ">
                                Easy
                            </span>

                        </div>

                        <span
                            class="difficulty-value"
                            style="
                                color:
                                ${difficultyColors.easy};
                            ">
                            ${difficulty.easy}%
                        </span>

                    </div>


                    <!-- MEDIUM -->

                    <div class="difficulty-item">

                        <div class="difficulty-item-left">

                            <span
                                class="difficulty-dot"
                                style="
                                    background:
                                    ${difficultyColors.medium};
                                ">
                            </span>

                            <span
                                class="difficulty-name"
                                style="
                                    color:
                                    ${difficultyColors.medium};
                                ">
                                Medium
                            </span>

                        </div>

                        <span
                            class="difficulty-value"
                            style="
                                color:
                                ${difficultyColors.medium};
                            ">
                            ${difficulty.medium}%
                        </span>

                    </div>


                    <!-- HARD -->

                    <div class="difficulty-item">

                        <div class="difficulty-item-left">

                            <span
                                class="difficulty-dot"
                                style="
                                    background:
                                    ${difficultyColors.hard};
                                ">
                            </span>

                            <span
                                class="difficulty-name"
                                style="
                                    color:
                                    ${difficultyColors.hard};
                                ">
                                Hard
                            </span>

                        </div>

                        <span
                            class="difficulty-value"
                            style="
                                color:
                                ${difficultyColors.hard};
                            ">
                            ${difficulty.hard}%
                        </span>

                    </div>

                </div>


                <div class="weakest-area">

                    Weakest:
                    <strong
                        style="
                            color:
                            ${difficultyColors[weakestDifficulty]};
                        ">
                        ${weakestDifficulty.toUpperCase()}
                    </strong>

                </div>

            `;


            /* Add card */

            difficultyGrid.appendChild(card);


            /* -----------------------------------------
               Canvas
            ----------------------------------------- */

            const canvas =
                document.getElementById(
                    `difficulty-chart-${subject.id}`
                );


            /* -----------------------------------------
               Doughnut Chart
            ----------------------------------------- */

            const chart =
                new Chart(

                    canvas,

                    {

                        type: "doughnut",


                        data: {

                            labels: [
                                "Score",
                                "Remaining"
                            ],


                            datasets: [

                                /* EASY */

                                {

                                    label: "Easy",

                                    data: [
                                        difficulty.easy,
                                        100 - difficulty.easy
                                    ],

                                    backgroundColor: [

                                        difficultyColors.easy,

                                        remainingColor

                                    ],

                                    borderWidth: 0,

                                    weight: 1

                                },


                                /* MEDIUM */

                                {

                                    label: "Medium",

                                    data: [
                                        difficulty.medium,
                                        100 - difficulty.medium
                                    ],

                                    backgroundColor: [

                                        difficultyColors.medium,

                                        remainingColor

                                    ],

                                    borderWidth: 0,

                                    weight: 1

                                },


                                /* HARD */

                                {

                                    label: "Hard",

                                    data: [
                                        difficulty.hard,
                                        100 - difficulty.hard
                                    ],

                                    backgroundColor: [

                                        difficultyColors.hard,

                                        remainingColor

                                    ],

                                    borderWidth: 0,

                                    weight: 1

                                }

                            ]

                        },


                        options: {

                            responsive: true,

                            maintainAspectRatio: false,

                            cutout: "58%",


                            plugins: {

                                legend: {

                                    display: false

                                },


                                tooltip: {

                                    callbacks: {

                                        label:
                                            function(context) {

                                                return `${context.dataset.label}: ${context.raw}%`;

                                            }

                                    }

                                }

                            }

                        }

                    }

                );


            difficultyCharts.push(chart);

        }
    );
}


/* =====================================================
   INITIALIZE
===================================================== */

createSubjectPerformanceChart();

createDifficultyCharts();


/*dhgbiawdjfgp*/
const ACTIVITY_STORAGE_KEY = "studentDailyActivity";


// ========================================
// DATE KEY
// ========================================

function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ========================================
// DISPLAY DATE
// ========================================

function formatActivityDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short"
    });
}


// ========================================
// RANDOM STUDY HOURS
// ========================================

function getRandomStudyHours() {
    return Number(
        (Math.random() * 7 + 2).toFixed(1)
    );
}


// ========================================
// GET SAVED DATA
// ========================================

function getSavedActivityData() {

    try {

        const savedData =
            localStorage.getItem(ACTIVITY_STORAGE_KEY);

        if (!savedData) {
            return [];
        }

        const parsedData = JSON.parse(savedData);

        return Array.isArray(parsedData)
            ? parsedData
            : [];

    } catch (error) {

        console.error(
            "Activity data error:",
            error
        );

        return [];
    }
}


// ========================================
// GENERATE 1 SEPTEMBER → TODAY
// ========================================

function generateActivityData() {

    const today = new Date();

    const startDate = new Date(
        today.getFullYear(),
        8, // September
        1
    );


    const savedData =
        getSavedActivityData();


    const activityData = [];


    for (
        let date = new Date(startDate);
        date <= today;
        date.setDate(date.getDate() + 1)
    ) {

        const dateKey =
            getDateKey(date);


        const existingRecord =
            savedData.find(
                item => item.date === dateKey
            );


        let studyHours;


        // Existing study hours preserve karo
        if (
            existingRecord &&
            existingRecord.studyHours !== undefined
        ) {

            studyHours =
                Number(existingRecord.studyHours);

        } else {

            // New date ke liye random hours
            studyHours =
                getRandomStudyHours();
        }


        /*
         * IMPORTANT:
         *
         * Agar purane localStorage record me
         * attendance missing hai, tab bhi Present
         * maana jayega.
         */

        let attendance = "Present";


        if (
            existingRecord &&
            existingRecord.attendance === "Absent"
        ) {

            attendance = "Absent";
        }


        activityData.push({

            date: dateKey,

            studyHours: studyHours,

            attendance: attendance
        });
    }


    // Updated data save karo
    localStorage.setItem(
        ACTIVITY_STORAGE_KEY,
        JSON.stringify(activityData)
    );


    return activityData;
}


// ========================================
// UPDATE SUMMARY
// ========================================

function updateActivitySummary() {

    const data =
        generateActivityData();


    const totalDays =
        data.length;


    const presentDays =
        data.filter(
            item => item.attendance === "Present"
        ).length;


    const totalStudyHours =
        data.reduce(
            (total, item) => {

                return total +
                    Number(item.studyHours);

            },
            0
        );


    const attendanceElement =
        document.getElementById(
            "attendance-summary"
        );


    const studyElement =
        document.getElementById(
            "study-summary"
        );


    if (attendanceElement) {

        attendanceElement.textContent =
            `${presentDays}/${totalDays} Present`;
    }


    if (studyElement) {

        studyElement.textContent =
            `${totalStudyHours.toFixed(1)} hrs studied`;
    }
}


// ========================================
// LINE CHART
// ========================================

let dailyActivityChart = null;


function createDailyActivityChart() {

    const data =
        generateActivityData();


    const labels =
        data.map(
            item =>
                formatActivityDate(item.date)
        );


    const studyHours =
        data.map(
            item =>
                Number(item.studyHours)
        );


    const canvas =
        document.getElementById(
            "dailyActivityChart"
        );


    if (!canvas) {

        console.error(
            "dailyActivityChart canvas not found."
        );

        return;
    }


    // Existing chart destroy karo
    if (dailyActivityChart) {

        dailyActivityChart.destroy();

        dailyActivityChart = null;
    }


    dailyActivityChart =
        new Chart(
            canvas,
            {

                type: "line",


                data: {

                    labels: labels,


                    datasets: [

                        {

                            label: "Study Hours",

                            data: studyHours,


                            borderColor:
                                "rgba(73, 196, 232, 0.9)",


                            backgroundColor:
                                "rgba(73, 196, 232, 0.10)",


                            borderWidth: 2,


                            fill: true,


                            tension: 0.4,


                            pointRadius: 4,


                            pointHoverRadius: 7,


                            pointBackgroundColor:
                                "rgba(73, 196, 232, 1)",


                            pointBorderColor:
                                "#030822",


                            pointBorderWidth: 2
                        }
                    ]
                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    interaction: {

                        mode: "index",

                        intersect: false
                    },


                    scales: {

                        y: {

                            min: 0,

                            max: 12,


                            title: {

                                display: true,

                                text: "Study Hours",

                                color: "#8f96ad",

                                font: {

                                    size: 12,

                                    weight: "500"
                                }
                            },


                            ticks: {

                                stepSize: 1,

                                color: "#8f96ad",

                                padding: 8,


                                callback: function(value) {

                                    return value + "h";
                                }
                            },


                            grid: {

                                color:
                                    "rgba(255,255,255,0.055)",

                                drawBorder: false
                            }
                        },


                        x: {

                            title: {

                                display: true,

                                text: "Date",

                                color: "#8f96ad",

                                font: {

                                    size: 12,

                                    weight: "500"
                                }
                            },


                            ticks: {

                                color: "#aeb4ca",

                                padding: 8,

                                maxRotation: 0
                            },


                            grid: {

                                display: false,

                                drawBorder: false
                            }
                        }
                    },


                    plugins: {

                        legend: {

                            display: false
                        },


                        tooltip: {

                            backgroundColor:
                                "#080f2b",

                            borderColor:
                                "#26345c",

                            borderWidth: 1,

                            padding: 12,

                            titleColor: "#fff",

                            bodyColor: "#aeb4ca",

                            displayColors: false,


                            callbacks: {

                                title: function(context) {

                                    const index =
                                        context[0].dataIndex;

                                    return formatActivityDate(
                                        data[index].date
                                    );
                                },


                                label: function(context) {

                                    const index =
                                        context.dataIndex;

                                    const item =
                                        data[index];


                                    return [

                                        `Study: ${item.studyHours} hours`,

                                        `Attendance: ${item.attendance}`

                                    ];
                                }
                            }
                        }
                    },


                    animation: {

                        duration: 800,

                        easing: "easeOutQuart"
                    }
                }
            }
        );
}


// ========================================
// INITIALIZE
// ========================================

updateActivitySummary();

createDailyActivityChart();