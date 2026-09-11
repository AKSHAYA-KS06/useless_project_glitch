// ============================================
// THINGVERSE FRONTEND
// ============================================


// ============================================
// ELEMENTS
// ============================================

const imageInput =
    document.getElementById("imageInput");

const cameraInput =
    document.getElementById("cameraInput");

const previewContainer =
    document.getElementById("previewContainer");

const previewImage =
    document.getElementById("previewImage");

const analyzeButton =
    document.getElementById("analyzeButton");

const loadingSection =
    document.getElementById("loadingSection");

const resultsSection =
    document.getElementById("resultsSection");

const loadingText =
    document.getElementById("loadingText");

const copyButton =
    document.getElementById("copyButton");

const newThingButton =
    document.getElementById("newThingButton");


// ============================================
// CURRENT IMAGE
// ============================================

let selectedFile = null;

let currentProfile = null;


// ============================================
// LOADING MESSAGES
// ============================================

const loadingMessages = [

    "Consulting the extremely unnecessary AI...",

    "Giving your object a personality...",

    "Checking its LinkedIn credentials...",

    "Searching for its soulmate...",

    "Reading its completely fictional destiny...",

    "Calculating unnecessary fun facts...",

    "Preparing a suspiciously detailed biography..."

];

let loadingInterval;


// ============================================
// IMAGE SELECTED
// ============================================

function handleImage(file) {

    if (!file) {
        return;
    }


    // Check image
    if (!file.type.startsWith("image/")) {

        alert(
            "Please choose an image file."
        );

        return;

    }


    // Check size
    if (file.size > 10 * 1024 * 1024) {

        alert(
            "Image must be smaller than 10 MB."
        );

        return;

    }


    selectedFile = file;


    // Preview image
    const imageURL =
        URL.createObjectURL(file);

    previewImage.src = imageURL;


    previewContainer.classList.remove(
        "hidden"
    );


    // Scroll to preview
    previewContainer.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// ============================================
// UPLOAD IMAGE
// ============================================

imageInput.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];

        handleImage(file);

    }
);


// ============================================
// CAMERA IMAGE
// ============================================

cameraInput.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];

        handleImage(file);

    }
);


// ============================================
// ANALYZE
// ============================================

analyzeButton.addEventListener(
    "click",
    analyzeImage
);


async function analyzeImage() {

    if (!selectedFile) {

        alert(
            "Please upload or capture an image first."
        );

        return;

    }


    // Hide upload section
    previewContainer.classList.add(
        "hidden"
    );


    // Show loading
    loadingSection.classList.remove(
        "hidden"
    );


    // Hide old results
    resultsSection.classList.add(
        "hidden"
    );


    // Start loading messages
    let messageIndex = 0;

    loadingText.textContent =
        loadingMessages[messageIndex];


    loadingInterval =
        setInterval(() => {

            messageIndex =
                (messageIndex + 1)
                % loadingMessages.length;

            loadingText.textContent =
                loadingMessages[messageIndex];

        }, 1800);


    // Create FormData
    const formData =
        new FormData();

    formData.append(
        "image",
        selectedFile
    );


    try {

        const response =
            await fetch(
                "/api/analyze",
                {
                    method: "POST",
                    body: formData
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Something went wrong."
            );

        }


        currentProfile =
            data.result;


        displayResults(
            currentProfile
        );


    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong:\n\n" +
            error.message
        );

    } finally {

        clearInterval(
            loadingInterval
        );

        loadingSection.classList.add(
            "hidden"
        );

    }

}


// ============================================
// DISPLAY RESULTS
// ============================================

function displayResults(data) {


    // Basic
    document.getElementById(
        "objectName"
    ).textContent =
        data.objectName || "Unknown Thing";


    document.getElementById(
        "oneLineDescription"
    ).textContent =
        data.oneLineDescription || "";


    document.getElementById(
        "funnyDescription"
    ).textContent =
        data.funnyDescription || "";


    // ========================================
    // PERSONALITY
    // ========================================

    const personalityTraits =
        document.getElementById(
            "personalityTraits"
        );

    personalityTraits.innerHTML = "";


    if (data.personality) {

        const traits = [

            data.personality.trait1,

            data.personality.trait2,

            data.personality.trait3

        ];


        traits.forEach(trait => {

            if (!trait) return;


            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "trait";

            element.textContent =
                "✨ " + trait;

            personalityTraits.appendChild(
                element
            );

        });

    }


    // ========================================
    // LINKEDIN
    // ========================================

    const linkedin =
        data.linkedin || {};


    document.getElementById(
        "linkedinHeadline"
    ).textContent =
        linkedin.headline || "";


    document.getElementById(
        "linkedinAbout"
    ).textContent =
        linkedin.about || "";


    document.getElementById(
        "linkedinRole"
    ).textContent =
        linkedin.currentRole || "";


    document.getElementById(
        "linkedinExperience"
    ).textContent =
        linkedin.experience || "";


    const skillsContainer =
        document.getElementById(
            "linkedinSkills"
        );

    skillsContainer.innerHTML = "";


    (linkedin.skills || []).forEach(
        skill => {

            const element =
                document.createElement(
                    "span"
                );

            element.className =
                "chip";

            element.textContent =
                skill;

            skillsContainer.appendChild(
                element
            );

        }
    );


    // ========================================
    // MATRIMONY
    // ========================================

    const matrimony =
        data.matrimony || {};


    document.getElementById(
        "marriageStatus"
    ).textContent =
        matrimony.status || "";


    document.getElementById(
        "marriageBio"
    ).textContent =
        matrimony.bio || "";


    document.getElementById(
        "bestMatch"
    ).textContent =
        matrimony.bestMatch || "";


    document.getElementById(
        "lookingFor"
    ).textContent =
        matrimony.lookingFor || "";


    // Green flags
    const greenFlags =
        document.getElementById(
            "greenFlags"
        );

    greenFlags.innerHTML = "";


    (matrimony.greenFlags || [])
        .forEach(flag => {

            const li =
                document.createElement(
                    "li"
                );

            li.textContent =
                flag;

            greenFlags.appendChild(li);

        });


    // Red flags
    const redFlags =
        document.getElementById(
            "redFlags"
        );

    redFlags.innerHTML = "";


    (matrimony.redFlags || [])
        .forEach(flag => {

            const li =
                document.createElement(
                    "li"
                );

            li.textContent =
                flag;

            redFlags.appendChild(li);

        });


    // ========================================
    // ASTROLOGY
    // ========================================

    const astrology =
        data.astrology || {};


    document.getElementById(
        "zodiac"
    ).textContent =
        astrology.zodiac || "";


    document.getElementById(
        "element"
    ).textContent =
        astrology.element || "";


    document.getElementById(
        "luckyNumber"
    ).textContent =
        astrology.luckyNumber || "";


    document.getElementById(
        "mood"
    ).textContent =
        astrology.mood || "";


    document.getElementById(
        "prediction"
    ).textContent =
        astrology.prediction || "";


    // ========================================
    // FUN FACTS
    // ========================================

    const funFacts =
        document.getElementById(
            "funFacts"
        );

    funFacts.innerHTML = "";


    (data.funFacts || [])
        .forEach(fact => {

            const li =
                document.createElement(
                    "li"
                );

            li.textContent =
                "🤯 " + fact;

            funFacts.appendChild(li);

        });


    // ========================================
    // DAILY LIFE
    // ========================================

    document.getElementById(
        "dailyLife"
    ).textContent =
        data.dailyLife || "";


    // ========================================
    // FINAL VERDICT
    // ========================================

    document.getElementById(
        "finalVerdict"
    ).textContent =
        data.finalVerdict || "";


    // ========================================
    // SHOW RESULTS
    // ========================================

    resultsSection.classList.remove(
        "hidden"
    );


    resultsSection.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


// ============================================
// COPY PROFILE
// ============================================

copyButton.addEventListener(
    "click",
    async function () {

        if (!currentProfile) {
            return;
        }


        const data =
            currentProfile;


        const linkedin =
            data.linkedin || {};

        const matrimony =
            data.matrimony || {};

        const astrology =
            data.astrology || {};


        const text = `

THINGVERSE PROFILE

${data.objectName}

${data.oneLineDescription}


🎭 PERSONALITY

${data.funnyDescription}


💼 LINKEDIN

${linkedin.headline}

${linkedin.about}

Current Role:
${linkedin.currentRole}

Skills:
${(linkedin.skills || []).join(", ")}

Experience:
${linkedin.experience}


💍 MATRIMONY

Status:
${matrimony.status}

${matrimony.bio}

Looking For:
${matrimony.lookingFor}

Best Match:
${matrimony.bestMatch}

Green Flags:
${(matrimony.greenFlags || []).join(", ")}

Red Flags:
${(matrimony.redFlags || []).join(", ")}


🔮 ASTROLOGY

Zodiac:
${astrology.zodiac}

Element:
${astrology.element}

Lucky Number:
${astrology.luckyNumber}

Mood:
${astrology.mood}

Prediction:
${astrology.prediction}


🤯 FUN FACTS

${(data.funFacts || []).join("\n")}


☀️ A DAY IN ITS LIFE

${data.dailyLife}


⚖️ FINAL VERDICT

${data.finalVerdict}

`;

        try {

            await navigator.clipboard.writeText(
                text
            );

            copyButton.textContent =
                "✅ Copied!";

            setTimeout(() => {

                copyButton.textContent =
                    "📋 Copy Profile";

            }, 2000);

        } catch (error) {

            alert(
                "Could not copy the profile."
            );

        }

    }
);


// ============================================
// NEW THING
// ============================================

newThingButton.addEventListener(
    "click",
    function () {

        selectedFile = null;

        currentProfile = null;


        imageInput.value = "";

        cameraInput.value = "";


        previewImage.src = "";


        resultsSection.classList.add(
            "hidden"
        );


        previewContainer.classList.add(
            "hidden"
        );


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }
);