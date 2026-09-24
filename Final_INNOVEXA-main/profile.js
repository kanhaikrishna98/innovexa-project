/* =========================================================
   PROFILE PAGE
   Uses the same "user" localStorage data as LOGIN/SIGNUP
   ========================================================= */


/* ================= PROFILE ELEMENTS ================= */

const profileName =
    document.querySelector("#profile-name");

const profileEmail =
    document.querySelector("#profile-email");

const profileCategory =
    document.querySelector("#profile-category");

const profileCourse =
    document.querySelector("#profile-course");

const profileImage =
    document.querySelector("#profile-image");

const profileImagePlaceholder =
    document.querySelector("#profile-image-placeholder");


/* ================= PROFILE INPUTS ================= */

const profileInputs = {

    name:
        document.querySelector("#profile-name-input"),

    email:
        document.querySelector("#profile-email-input"),

    category:
        document.querySelector("#profile-category-input"),

    mobile:
        document.querySelector("#profile-mobile-input"),

    className:
        document.querySelector("#profile-class-input"),

    course:
        document.querySelector("#profile-course-input"),

    college:
        document.querySelector("#profile-college-input"),

    highestEducation:
        document.querySelector("#profile-education-input"),

    specialization:
        document.querySelector("#profile-specialization-input"),

    academicYear:
        document.querySelector("#profile-year-input"),

    studentId:
        document.querySelector("#profile-student-id-input"),

    city:
        document.querySelector("#profile-city-input"),

    dateOfBirth:
        document.querySelector("#profile-dob-input"),

    institutionType:
        document.querySelector("#profile-institution-input")
};


/* ================= PROFILE BUTTONS ================= */

const editProfileBtn =
    document.querySelector("#edit-profile-btn");

const saveProfileBtn =
    document.querySelector("#profile-save-btn");

const cancelProfileBtn =
    document.querySelector("#profile-cancel-btn");

const profileActions =
    document.querySelector("#profile-actions");

const profileImageInput =
    document.querySelector("#profile-image-input");

const profileSaveMessage =
    document.querySelector("#profile-save-message");


/* ================= CURRENT USER ================= */

let profileUser = null;

let oldProfileData = null;

let profileEditing = false;


/* ================= LOAD USER ================= */

async function loadProfileUser() {

    try {
        const response = await window.innovexaApi.me();
        profileUser = response.user;

    } catch (error) {

        console.error(
            "Unable to read user data:",
            error
        );

        return;
    }


    /* Make sure new fields exist */

    profileUser.mobile =
        profileUser.mobile || "";

    profileUser.className =
        profileUser.className || "";

    profileUser.course =
        profileUser.course || "";

    profileUser.college =
        profileUser.college || "";

    profileUser.highestEducation =
        profileUser.highestEducation || "";

    profileUser.specialization =
        profileUser.specialization || "";

    profileUser.academicYear =
        profileUser.academicYear || "";

    profileUser.studentId =
        profileUser.studentId || "";

    profileUser.city =
        profileUser.city || "";

    profileUser.dateOfBirth =
        profileUser.dateOfBirth || "";

    profileUser.institutionType =
        profileUser.institutionType || "";


    showProfileData();

}


/* ================= SHOW PROFILE DATA ================= */

function showProfileData() {

    if (!profileUser) {
        return;
    }


    /* Basic profile */

    if (profileName) {

        profileName.textContent =
            profileUser.name || "Student Name";

    }


    if (profileEmail) {

        profileEmail.textContent =
            profileUser.email ||
            "student@example.com";

    }


    if (profileCategory) {

        profileCategory.textContent =
            profileUser.category ||
            "Student";

    }


    if (profileCourse) {

        profileCourse.textContent =
            profileUser.course ||
            "Course not added";

    }


    /* Profile image */

    if (profileImage) {

        if (profileUser.image) {

            profileImage.src =
                profileUser.image;

            profileImage.style.display =
                "block";

            if (profileImagePlaceholder) {

                profileImagePlaceholder.style.display =
                    "none";

            }

        } else {

            profileImage.style.display =
                "none";

            if (profileImagePlaceholder) {

                profileImagePlaceholder.style.display =
                    "flex";

            }

        }

    }


    /* Fill form */

    Object.keys(profileInputs).forEach(key => {

        const input =
            profileInputs[key];

        if (!input) {
            return;
        }

        input.value =
            profileUser[key] || "";

    });

}


/* ================= EDIT MODE ================= */

function setProfileEditingMode(editing) {

    profileEditing = editing;


    Object.values(profileInputs).forEach(input => {

        if (input) {

            input.disabled =
                !editing;

        }

    });


    if (profileActions) {

        if (editing) {

            profileActions.classList.add("show");

        } else {

            profileActions.classList.remove("show");

        }

    }


    if (editProfileBtn) {

        if (editing) {

            editProfileBtn.innerHTML =
                '<i class="fa-solid fa-xmark"></i> Cancel Editing';

        } else {

            editProfileBtn.innerHTML =
                '<i class="fa-solid fa-pen"></i> Edit Profile';

        }

    }

}


/* ================= EDIT PROFILE ================= */

if (editProfileBtn) {

    editProfileBtn.addEventListener(
        "click",
        () => {

            if (profileEditing) {

                profileUser =
                    JSON.parse(
                        JSON.stringify(
                            oldProfileData
                        )
                    );

                showProfileData();

                setProfileEditingMode(false);

                return;
            }


            oldProfileData =
                JSON.parse(
                    JSON.stringify(
                        profileUser
                    )
                );

            setProfileEditingMode(true);

        }
    );

}


/* ================= GET FORM DATA ================= */

function getProfileFormData() {

    const updatedUser =
        {
            ...profileUser
        };


    Object.keys(profileInputs).forEach(key => {

        const input =
            profileInputs[key];

        if (input) {

            updatedUser[key] =
                input.value.trim();

        }

    });


    return updatedUser;

}


/* ================= SAVE PROFILE ================= */

if (saveProfileBtn) {

    saveProfileBtn.addEventListener(
        "click",
        async () => {

            if (!profileUser) {
                return;
            }


            profileUser =
                getProfileFormData();


            try {
                const response = await window.innovexaApi.request("/api/auth/me", {
                    method: "PATCH",
                    body: {
                        name: profileUser.name,
                        branch: profileUser.category || profileUser.branch || null,
                        semester: profileUser.semester || profileUser.className || null
                    }
                });
                profileUser = response.user;
            } catch (error) {
                alert(error.message);
                return;
            }


            oldProfileData =
                JSON.parse(
                    JSON.stringify(
                        profileUser
                    )
                );


            showProfileData();

            setProfileEditingMode(false);

            showProfileSavedMessage();


            /*
                Update dashboard/header
                immediately if those elements
                exist on the same page.
            */

            if (
                typeof showUserData ===
                "function"
            ) {

                showUserData(
                    profileUser
                );

            }

        }
    );

}


/* ================= CANCEL ================= */

if (cancelProfileBtn) {

    cancelProfileBtn.addEventListener(
        "click",
        () => {

            if (!oldProfileData) {
                return;
            }


            profileUser =
                JSON.parse(
                    JSON.stringify(
                        oldProfileData
                    )
                );


            showProfileData();

            setProfileEditingMode(false);

        }
    );

}


/* ================= CHANGE PROFILE IMAGE ================= */

if (profileImageInput) {

    profileImageInput.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            if (!file) {
                return;
            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Please select a valid image."
                );

                return;
            }


            const reader =
                new FileReader();


            reader.onload = () => {

                /*
                    Image is stored in the same
                    user object.

                    So dashboard and profile
                    can use the same image.
                */

                profileUser.image =
                    reader.result;


                profileImage.src =
                    reader.result;

                profileImage.style.display =
                    "block";


                if (profileImagePlaceholder) {

                    profileImagePlaceholder.style.display =
                        "none";

                }


                /*
                    Automatically enter
                    edit mode if not already editing.
                */

                if (!profileEditing) {

                    oldProfileData =
                        JSON.parse(
                            JSON.stringify(
                                profileUser
                            )
                        );

                    setProfileEditingMode(true);

                }

            };


            reader.readAsDataURL(file);

        }
    );

}


/* ================= SAVE MESSAGE ================= */

function showProfileSavedMessage() {

    if (!profileSaveMessage) {
        return;
    }


    profileSaveMessage.classList.add(
        "show"
    );


    setTimeout(() => {

        profileSaveMessage.classList.remove(
            "show"
        );

    }, 2500);

}


/* ================= INITIALIZE ================= */

if (
    document.querySelector(
        ".profile-page"
    )
) {

    loadProfileUser();

    setProfileEditingMode(false);

}