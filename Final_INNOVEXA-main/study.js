
/* =====================================================
   INNOVEXA STUDY PLAN
   Frontend logic
   Backend API can be connected later
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const studyHoursInput = document.getElementById("study-hours");
    const studyLevel = document.getElementById("study-level");
    const studyDays = document.getElementById("study-days");

    const generateButton = document.getElementById("generate-plan-btn");
    const regenerateButton = document.getElementById("regenerate-btn");

    const message = document.getElementById("study-plan-message");

    const selectedSubjectCount =
        document.getElementById("selected-subject-count");

    const summaryBox =
        document.getElementById("plan-summary");

    const generatedPlan =
        document.getElementById("generated-plan");

    const scheduleList =
        document.getElementById("schedule-list");

    const summaryHours =
        document.getElementById("summary-hours");

    const summarySubjects =
        document.getElementById("summary-subjects");

    const summaryDays =
        document.getElementById("summary-days");

    const summaryFocus =
        document.getElementById("summary-focus");

    const planDescription =
        document.getElementById("plan-description");

    const subjectInputs =
        document.querySelectorAll(".subject-option input");


    /* =========================================
       SUBJECT COUNT
       ========================================= */

    function updateSubjectCount() {

        const selectedSubjects =
            document.querySelectorAll(
                ".subject-option input:checked"
            );

        selectedSubjectCount.textContent =
            `${selectedSubjects.length} selected`;
    }


    subjectInputs.forEach(input => {

        input.addEventListener("change", updateSubjectCount);

    });


    /* =========================================
       GET SELECTED SUBJECTS
       ========================================= */

    function getSelectedSubjects() {

        const selected =
            document.querySelectorAll(
                ".subject-option input:checked"
            );

        return Array.from(selected).map(input => {

            return {
                name: input.value,
                performance:
                    Number(input.dataset.performance || 0)
            };

        });
    }


    /* =========================================
       CALCULATE SUBJECT PRIORITY
       ========================================= */

    function calculatePriority(subject) {

        /*
           Lower performance = higher priority.

           0 means the student has not tested
           the subject yet.
        */

        if (subject.performance === 0) {
            return 100;
        }

        return 100 - subject.performance;
    }


    /* =========================================
       GENERATE STUDY PLAN
       ========================================= */

    function generateStudyPlan() {

        message.textContent = "";

        const hours =
            Number(studyHoursInput.value);

        const days =
            Number(studyDays.value);

        const level =
            studyLevel.value;

        let subjects =
            getSelectedSubjects();


        /* VALIDATION */

        if (!hours || hours <= 0) {

            message.textContent =
                "Please enter your available study time.";

            return;
        }


        if (subjects.length === 0) {

            message.textContent =
                "Please select at least one subject.";

            return;
        }


        if (hours > 12) {

            message.textContent =
                "Please enter study time up to 12 hours.";

            return;
        }


        /* =====================================
           SORT SUBJECTS BY PRIORITY
           ===================================== */

        subjects.sort((a, b) => {

            return calculatePriority(b) -
                   calculatePriority(a);

        });


        /* =====================================
           FIND MAIN FOCUS SUBJECT
           ===================================== */

        const focusSubject =
            subjects[0];


        /* =====================================
           UPDATE SUMMARY
           ===================================== */

        summaryHours.textContent =
            `${hours} hrs`;

        summarySubjects.textContent =
            subjects.length;

        summaryDays.textContent =
            `${days} ${days === 1 ? "Day" : "Days"}`;

        summaryFocus.textContent =
            focusSubject.name;


        /* =====================================
           DESCRIPTION
           ===================================== */

        planDescription.textContent =
            `Your plan focuses more on ${focusSubject.name} based on your current performance.`;


        /* =====================================
           GENERATE SCHEDULE
           ===================================== */

        createSchedule(
            subjects,
            hours,
            level
        );


        /* SHOW RESULTS */

        summaryBox.classList.add("show");

        generatedPlan.classList.add("show");

        generatedPlan.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


        /* SAVE LOCALLY FOR NOW */

        savePlanLocally(
            subjects,
            hours,
            days,
            level
        );


        /*
           FUTURE BACKEND:

           This function can later send
           the same data to:

           POST /api/study-plan
        */

        // savePlanToBackend({
        //     subjects,
        //     hours,
        //     days,
        //     level
        // });
    }


    /* =========================================
       CREATE DAILY SCHEDULE
       ========================================= */

    function createSchedule(
        subjects,
        totalHours,
        level
    ) {

        scheduleList.innerHTML = "";

        const totalMinutes =
            Math.round(totalHours * 60);


        /*
           Break time = approximately 10%
           of total study time.
        */

        const breakMinutes =
            Math.max(
                5,
                Math.round(totalMinutes * 0.1)
            );


        const studyMinutes =
            totalMinutes - breakMinutes;


        /*
           Divide study time according
           to subject priority.
        */

        const priorities =
            subjects.map(subject =>
                calculatePriority(subject)
            );

        const totalPriority =
            priorities.reduce(
                (sum, value) => sum + value,
                0
            );


        let currentMinutes = 0;


        subjects.forEach((subject, index) => {

            let subjectMinutes;

            /*
               Last subject receives remaining
               time to avoid rounding errors.
            */

            if (index === subjects.length - 1) {

                subjectMinutes =
                    studyMinutes -
                    currentMinutes;

            } else {

                subjectMinutes =
                    Math.round(
                        studyMinutes *
                        (
                            priorities[index] /
                            totalPriority
                        )
                    );

            }


            /*
               Prevent extremely short sessions.
            */

            subjectMinutes =
                Math.max(
                    20,
                    subjectMinutes
                );


            currentMinutes += subjectMinutes;


            const startTime =
                convertMinutesToTime(
                    18 * 60 + currentMinutes - subjectMinutes
                );


            const endTime =
                convertMinutesToTime(
                    18 * 60 + currentMinutes
                );


            const scheduleItem =
                document.createElement("div");

            scheduleItem.className =
                "schedule-item";


            scheduleItem.innerHTML = `

                <div class="schedule-time">
                    ${startTime} - ${endTime}
                </div>

                <div class="schedule-main">

                    <strong>
                        ${subject.name}
                    </strong>

                    <span>
                        ${
                            subject.performance === 0
                            ? "Build your foundation and take a test"
                            : getStudyTask(
                                subject,
                                level
                              )
                        }
                    </span>

                </div>

                <div class="schedule-duration">
                    ${subjectMinutes} min
                </div>

            `;


            scheduleList.appendChild(
                scheduleItem
            );


            /*
               Add break after every subject
               except the last one.
            */

            if (index < subjects.length - 1) {

                const breakItem =
                    document.createElement("div");

                breakItem.className =
                    "schedule-item";

                breakItem.innerHTML = `

                    <div class="schedule-time">
                        ${endTime}
                    </div>

                    <div class="schedule-main">

                        <strong>
                            Short Break
                        </strong>

                        <span>
                            Rest, hydrate and refresh your mind.
                        </span>

                    </div>

                    <div class="schedule-duration">
                        ${breakMinutes} min
                    </div>

                `;

                scheduleList.appendChild(
                    breakItem
                );
            }

        });

    }


    /* =========================================
       STUDY TASK
       ========================================= */

    function getStudyTask(subject, level) {

        if (subject.performance < 40) {

            return "Revise fundamentals and practice basic questions.";

        }

        if (subject.performance < 60) {

            return "Strengthen weak concepts and solve practice problems.";

        }

        if (subject.performance < 80) {

            return "Revise concepts and practice medium-level problems.";

        }

        if (level === "advanced") {

            return "Solve advanced problems and revise difficult concepts.";

        }

        return "Practice questions and revise important concepts.";
    }


    /* =========================================
       TIME CONVERSION
       ========================================= */

    function convertMinutesToTime(totalMinutes) {

        /*
           Keep time within one day.
        */

        totalMinutes =
            totalMinutes % (24 * 60);


        const hours =
            Math.floor(totalMinutes / 60);

        const minutes =
            totalMinutes % 60;


        const displayHour =
            hours % 12 || 12;

        const period =
            hours >= 12 ? "PM" : "AM";


        return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
    }


    /* =========================================
       LOCAL STORAGE
       ========================================= */

    function savePlanLocally(
        subjects,
        hours,
        days,
        level
    ) {

        const studyPlan = {

            subjects: subjects,

            dailyHours: hours,

            duration: days,

            level: level,

            createdAt:
                new Date().toISOString()

        };


        localStorage.setItem(
            "innovexaStudyPlan",
            JSON.stringify(studyPlan)
        );
    }


    /* =========================================
       LOAD PREVIOUS PLAN
       ========================================= */

    function loadPreviousPlan() {

        const savedPlan =
            localStorage.getItem(
                "innovexaStudyPlan"
            );


        if (!savedPlan) {
            return;
        }


        try {

            const plan =
                JSON.parse(savedPlan);


            if (plan.dailyHours) {

                studyHoursInput.value =
                    plan.dailyHours;
            }


            if (plan.duration) {

                studyDays.value =
                    plan.duration;
            }


            if (plan.level) {

                studyLevel.value =
                    plan.level;
            }


            if (Array.isArray(plan.subjects)) {

                plan.subjects.forEach(
                    savedSubject => {

                        subjectInputs.forEach(
                            input => {

                                if (
                                    input.value ===
                                    savedSubject.name
                                ) {

                                    input.checked = true;

                                }

                            }
                        );

                    }
                );

            }


            updateSubjectCount();

        } catch (error) {

            console.error(
                "Unable to load saved study plan:",
                error
            );

        }

    }


    /* =========================================
       BUTTON EVENTS
       ========================================= */

    generateButton.addEventListener(
        "click",
        generateStudyPlan
    );


    regenerateButton.addEventListener(
        "click",
        generateStudyPlan
    );


    /* =========================================
       INITIAL LOAD
       ========================================= */

    loadPreviousPlan();

});

