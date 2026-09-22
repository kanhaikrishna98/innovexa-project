let aside_btn = document.querySelector("#aside-btn");
let aside = document.querySelector("#aside");
let content = document.querySelector("#content");

aside_btn.onclick = () => {
    aside.classList.toggle("active-aside");
    content.classList.toggle("active-content");

    aside_btn.classList.toggle("active");

    if (aside_btn.classList.contains("active")) {
        aside_btn.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>';
    } else {
        aside_btn.innerHTML = '<i class="fa-solid fa-bars"></i>'
    }
};

//clock
function updateDateTime() {

    const now = new Date();

    // Time
    let hours = String(now.getHours()).padStart(2, "0");
    let minutes = String(now.getMinutes()).padStart(2, "0");
    let seconds = String(now.getSeconds()).padStart(2, "0");

    // Date
    const day = now.getDate();

    const months = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ];

    const month = months[now.getMonth()];
    const year = now.getFullYear();

    // Day name
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    const dayName = days[now.getDay()];

    // Display
    document.querySelector(".time").textContent =
        `${hours}:${minutes}:${seconds}`;

    document.querySelector(".date").textContent =
        `${day} ${month} ${year}`;

    document.querySelector(".day").textContent =
        dayName;
}

updateDateTime();

setInterval(updateDateTime, 1000);
//login 
/* ========== LOGIN / SIGNUP ELEMENTS==================== */
// ===============================
// AUTH ELEMENTS
// ===============================

const authSection = document.querySelector("#auth-section");
const loginBox = document.querySelector("#login-box");
const signupBox = document.querySelector("#signup-box");

const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");

const showSignup = document.querySelector("#show-signup");
const showLogin = document.querySelector("#show-login");


// ===============================
// SHOW USER DATA
// ===============================

function showUserData(user) {

    const name = document.querySelector("#user-name");
    if (name && name.childNodes[0]) name.childNodes[0].nodeValue = user.name;

    const profession = document.querySelector("#user-profession");
    if (profession) profession.textContent = user.branch || user.category || "Student";

    const image = document.querySelector("#user-pic");
    if (image && user.image) image.src = user.image;

    const userName = document.querySelector(".urname");
    if (userName) userName.textContent = user.name;

    const email = document.querySelector("#user-email");
    if (email) email.textContent = user.email;
}

function showAuthError(error) {
    alert(error instanceof Error ? error.message : "Unable to connect to the backend.");
}

async function restoreSession() {
    if (!window.innovexaApi) {
        showAuthError(new Error("Backend client is not loaded. Open the frontend from a local server and ensure api.js is included."));
        return;
    }
    try {
        const { user } = await window.innovexaApi.me();
        showUserData(user);
        document.body.classList.add("logged-in");
    } catch (error) {
        document.body.classList.remove("logged-in");
    }
}

restoreSession();


// ===============================
// LOGIN / SIGNUP SWITCH
// ===============================

if (showSignup) showSignup.onclick = () => {

    loginBox.style.display = "none";
    signupBox.style.display = "block";

};


if (showLogin) showLogin.onclick = () => {

    signupBox.style.display = "none";
    loginBox.style.display = "block";

};


// ===============================
// SIGNUP
// ===============================

if (signupForm) signupForm.onsubmit = async (event) => {

    event.preventDefault();

    const name =
        document.querySelector("#signup-name").value;

    const category =
        document.querySelector("#signup-category").value;

    const email =
        document.querySelector("#signup-email").value;

    const password =
        document.querySelector("#signup-password").value;

    try {
        const { user } = await window.innovexaApi.signup({
            name,
            email,
            password,
            branch: category
        });
        showUserData(user);
        document.body.classList.add("logged-in");
        signupForm.reset();
        if (signupBox) signupBox.style.display = "none";
        if (loginBox) loginBox.style.display = "block";
    } catch (error) {
        showAuthError(error);
    }

};


// ===============================
// LOGIN
// ===============================

if (loginForm) loginForm.onsubmit = async (event) => {

    event.preventDefault();


    const email =
        document.querySelector("#login-email").value;

    const password =
        document.querySelector("#login-password").value;


    try {
        const { user } = await window.innovexaApi.login({ email, password });
        showUserData(user);
        document.body.classList.add("logged-in");
    } catch (error) {
        showAuthError(error);
    }

};


// ===============================
// LOGOUT
// ===============================

const logoutLink =
    document.querySelector('a[href="logout.html"]');


if (logoutLink) {

    logoutLink.addEventListener("click", (event) => {

        event.preventDefault();


        window.innovexaApi.logout()
            .catch(showAuthError)
            .finally(() => {
                document.body.classList.remove("logged-in");
                if (loginBox) loginBox.style.display = "block";
                if (signupBox) signupBox.style.display = "none";
            });

    });

}
/* ================= PERFORMANCE CHART ================= */
