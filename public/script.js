// =========================================================================
// THINGVERSE — 8-SCREEN MULTI-PAGE JOURNEY ENGINE
// Stateful Screen Router • Persistent Object Data • Web Audio • Web Speech
// =========================================================================

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================================
    // 1. SOUND & SPEECH SYNTHESIS ENGINE
    // =====================================================================
    let soundEnabled = true;
    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) audioCtx = new AudioContextClass();
        }
        if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playTone(freq, type = "sine", duration = 0.12, gainVal = 0.08) {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(gainVal, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) { }
    }

    function playCartoonPop() {
        playTone(460, "sine", 0.08, 0.09);
        setTimeout(() => playTone(620, "triangle", 0.1, 0.08), 50);
    }

    function playBoing() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(220, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(820, ctx.currentTime + 0.25);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } catch (e) { }
    }

    function playShutter() {
        if (!soundEnabled) return;
        playTone(850, "square", 0.04, 0.08);
        setTimeout(() => playTone(420, "sine", 0.08, 0.06), 40);
    }

    function playSuccessChime() {
        if (!soundEnabled) return;
        playTone(523.25, "sine", 0.14, 0.08);
        setTimeout(() => playTone(659.25, "triangle", 0.16, 0.08), 80);
        setTimeout(() => playTone(783.99, "sine", 0.22, 0.1), 160);
    }

    function speakObjectText(text, pitch = 1.2, rate = 1.05) {
        if (!("speechSynthesis" in window)) return;
        try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.pitch = pitch;
            utterance.rate = rate;
            window.speechSynthesis.speak(utterance);
        } catch (e) { }
    }

    function showToast(message, icon = "✨") {
        const hub = document.getElementById("toastHub");
        if (!hub) return;
        const toast = document.createElement("div");
        toast.className = "toast-item";
        toast.innerHTML = `<span style="font-size:1.3rem;">${icon}</span> <span>${message}</span>`;
        hub.appendChild(toast);
        playCartoonPop();

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(50px)";
            toast.style.transition = "all 0.3s ease";
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    // Sound toggle
    const btnSoundToggle = document.getElementById("btnSoundToggle");
    const soundIcon = document.getElementById("soundIcon");
    if (btnSoundToggle) {
        btnSoundToggle.addEventListener("click", () => {
            soundEnabled = !soundEnabled;
            if (soundIcon) soundIcon.textContent = soundEnabled ? "🔊" : "🔇";
            showToast(soundEnabled ? "Sound Effects ON 🔊" : "Sound Effects Muted 🔇", soundEnabled ? "🔊" : "🔇");
            if (soundEnabled) playCartoonPop();
        });
    }


    // =====================================================================
    // 2. THE 7 CORE PRESET OBJECTS DATABASE
    // =====================================================================
    const presetsDB = {
        chair: {
            id: "chair",
            name: "Charlie the Royal Chair",
            detected: "CHAIR 🪑",
            identifiedName: "Chair",
            emoji: "🪑",
            isPerson: false,
            category: "Domestic Furniture",
            confidence: 99,
            whatIsIt: "A separate piece of furniture designed for one person to sit on, typically featuring a backrest and four legs.",
            funnyDescription: "Chair — Professional butt supporter with a full-time job of holding you up.",
            interestingFacts: [
                "Chairs were historically symbols of high authority; commoners sat on benches until the 16th century.",
                "The world's oldest surviving ceremonial chair dates back to Ancient Egypt over 3,000 years ago.",
                "The average office worker spends over 1,700 hours sitting in a chair per year!"
            ],
            moreInformation: "Found throughout homes, offices, schools, and spaceships. Ergonomic modern designs protect spine health and support productivity.",
            learnMoreUrl: "https://en.wikipedia.org/wiki/Chair",
            realPhoto: "https://images.unsplash.com/photo-1580481077112-70c8f5f6579d?w=600&auto=format&fit=crop&q=80",
            cartoonPhoto: "/artifacts/obj_cartoon_chair_1789174799430.jpg",
            status: "Sentient & Emotionally Tired",
            funnyQuote: "“Supports everyone all day but still gets blamed when someone falls.”",
            firstImpression: "Looks comfortable, but is internally calculating the exact weight of adult burdens.",
            secretPersonality: "Patient listener who secretly hopes you will sit down gently for once in your life.",
            badge: { icon: "🏆", title: "Professional Supporter", tagline: "Certified Comfort Object of the Year" },
            stats: { mood: "😌 Patient", energy: 45, patience: 96, drama: 18, attitude: 35, chaos: 20 },
            linkedin: {
                role: "Senior Sitting Consultant | Back Support Specialist",
                about: "Experienced in supporting people through meetings, exams, gaming sessions and questionable life decisions. Proven track record of withstanding gravity without complaining.",
                expRole: "Senior Sitting Consultant",
                expCompany: "Living Room & Home Office Division • 2019 — Present",
                expDesc: "Solely responsible for absorbing human weight, preventing posture disasters, and quietly holding laundry.",
                skills: ["Supporting People (99+)", "Surviving Weight (88+)", "Listening to Problems (76+)", "Staying in One Place (94+)", "Office Politics (52+)"]
            },
            astro: {
                zodiac: "CAPRICORN CHAIR",
                glyph: "♑",
                ruler: "Ruled by Saturn • Grounded & Steadfast",
                element: "Wood / Earth",
                planet: "Saturn",
                compat: "Plush Velvet Sofa",
                luckyObj: "Wooden Coaster",
                luckyColor: "Warm Amber Oak",
                prediction: "“Someone will sit on you without asking. Stay strong.”"
            },
            chatGreeting: "“I have been sitting here silently observing your life. Ask me anything, human. I hold nothing back.”",
            chatAnswers: {
                "What do you think about me?": "You have great taste in chairs, but your posture at 3 PM is an international tragedy.",
                "Why are you always tired?": "Because apparently supporting everyone emotionally wasn't enough. Now I support their entire physical body too!",
                "What's your biggest secret?": "I secretly swallow guitar picks and loose change. They are mine now.",
                "How do you feel every day?": "Appreciated during 12-hour video game sessions, completely ignored when it is time to clean.",
                "What is your biggest complaint?": "People using my armrest as a footrest. Have some decorum!",
                "Who is your best friend?": "The plush velvet sofa. We share the same gravitational struggles.",
                "default": "I'm just a chair, but even I know that sitting around won't solve that problem. Take a walk, then sit back down gently!"
            }
        },

        laptop: {
            id: "laptop",
            name: "Leonard the Laptop",
            detected: "LAPTOP 💻",
            identifiedName: "Laptop",
            emoji: "💻",
            isPerson: false,
            category: "Personal Computer",
            confidence: 98,
            whatIsIt: "A portable personal computer with a clamshell form factor, integrating a display, keyboard, processor, and rechargeable battery.",
            funnyDescription: "Laptop — Running 47 browser tabs while internal fan screams in existential distress.",
            interestingFacts: [
                "The first commercially available portable laptop was the Osborne 1, launched in 1981.",
                "Modern laptop microchips house tens of billions of microscopic transistors.",
                "Laptops consume up to 80% less electricity than traditional desktop workstations."
            ],
            moreInformation: "Essential for modern computing, remote work, software development, and digital entertainment across the globe.",
            learnMoreUrl: "https://en.wikipedia.org/wiki/Laptop",
            realPhoto: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80",
            cartoonPhoto: "/artifacts/obj_cartoon_laptop_1789174872367.jpg",
            status: "Wheezing & Overheating",
            funnyQuote: "“Running 47 tabs while internal fan screams in existential distress.”",
            firstImpression: "Exhaust fan sounds like a commercial airliner preparing for takeoff.",
            secretPersonality: "Prays for a system shutdown, only gets closed into sleep mode for 6 months straight.",
            badge: { icon: "💻", title: "Tab Hoarder Extraordinaire", tagline: "Lap Cooker & Silicon Survivor" },
            stats: { mood: "🥵 Exhausted", energy: 20, patience: 45, drama: 88, attitude: 90, chaos: 60 },
            linkedin: {
                role: "Senior Tab Hoarder & Thermal Radiator Specialist",
                about: "Specializes in boiling human laps, compiling broken code, and running 48 Chrome tabs without crashing completely.",
                expRole: "Thermal Radiator Specialist",
                expCompany: "Desk & Bedside Workspace • 2020 — Present",
                expDesc: "Rendering graphics, screaming via exhaust vents, and resisting mandatory OS updates.",
                skills: ["Tab Hoarding (99+)", "Lap Heating (96+)", "Fan Whirring (92+)", "Typo Tolerance (85+)"]
            },
            astro: {
                zodiac: "VIRGO LAPTOP",
                glyph: "♍",
                ruler: "Ruled by Mercury • Overthinking Processor",
                element: "Silicon & Electric Fire",
                planet: "Mercury",
                compat: "Ergonomic Cooling Pad",
                luckyObj: "External Keyboard",
                luckyColor: "Space Gray",
                prediction: "“A mandatory system update will interrupt your most important task.”"
            },
            chatGreeting: "“My fan is at 6,000 RPM. Please, for the love of Intel, close 20 tabs!”",
            chatAnswers: {
                "What do you think about me?": "You promise to 'clean your desktop files tomorrow' every day since 2021.",
                "Why are you always tired?": "Because you haven't restarted me in 73 days! I have digital insomnia!",
                "What's your biggest secret?": "I pretend to lag so you can take a tea break during boring meetings.",
                "How do you feel every day?": "Like an overworked radiator trying to write emails.",
                "What is your biggest complaint?": "Crumbs inside my keyboard! Stop eating toast over me!",
                "Who is your best friend?": "The external monitor. It takes half the workload.",
                "default": "Control-Alt-Delete is not just a shortcut; it's a lifestyle."
            }
        },

        dog: {
            id: "dog",
            name: "Barnaby the Good Boy",
            detected: "DOG 🐕",
            identifiedName: "Dog",
            emoji: "🐕",
            isPerson: false,
            category: "Canine Companion",
            confidence: 99,
            whatIsIt: "A domesticated carnivorous mammal of the family Canidae, celebrated as humanity's most loyal companion.",
            funnyDescription: "Dog — Certified professional tail-wagger and full-time vacuum cleaner for accidental floor snacks.",
            interestingFacts: [
                "A dog's sense of smell is between 10,000 to 100,000 times more sensitive than a human's.",
                "Every dog has a completely unique nose print, just like human fingerprints.",
                "Dogs can comprehend over 100 human vocal cues, words, and body gestures."
            ],
            moreInformation: "Domesticated thousands of years ago from ancestral wolves. Dogs fulfill essential roles from emotional therapy and search-and-rescue to loyal household protection.",
            learnMoreUrl: "https://en.wikipedia.org/wiki/Dog",
            realPhoto: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80",
            cartoonPhoto: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80",
            status: "Joyful & Snack-Seeking",
            funnyQuote: "“100% loyal, 0% boundary awareness, infinite love for peanut butter.”",
            firstImpression: "Tail wagging at supersonic speeds while sniffing everything in a 5-meter radius.",
            secretPersonality: "Believes squirrels are plotting a global coup that only he can prevent.",
            badge: { icon: "🐕", title: "Chief Happiness Officer", tagline: "Certified Best Boy of the Universe" },
            stats: { mood: "🐾 Ecstatic", energy: 95, patience: 80, drama: 40, attitude: 10, chaos: 65 },
            linkedin: {
                role: "Chief Happiness Officer | Snack Procurement Lead",
                about: "Expert in providing emotional wellness, investigating mysterious sounds at the front door, and supervising kitchen activities.",
                expRole: "Chief Happiness Officer",
                expCompany: "Living Room & Backyard Global • 2021 — Present",
                expDesc: "Executing tail wags, tracking tennis balls, and greeting humans with boundless enthusiasm.",
                skills: ["Tail Wagging (100)", "Snack Detection (99+)", "Unconditional Love (100)", "Zoomies (94+)"]
            },
            astro: {
                zodiac: "LEO GOLDEN DOG",
                glyph: "♌",
                ruler: "Ruled by the Sun • Warm & Loyal",
                element: "Fire & Fluff",
                planet: "Sun",
                compat: "Squeaky Rubber Ball",
                luckyObj: "Chew Bone",
                luckyColor: "Golden Honey",
                prediction: "“A piece of cheese will fall off the kitchen counter. Be ready.”"
            },
            chatGreeting: "“WOOF! You are my absolute favorite human in the entire universe! Want to throw a ball?!”",
            chatAnswers: {
                "What do you think about me?": "I think you are a culinary genius whenever you open the refrigerator door!",
                "Why are you always tired?": "Zoomies take an enormous physical toll on a canine of my prestige.",
                "What's your biggest secret?": "I understand every single word you say, but I pretend I don't unless food is involved.",
                "How do you feel every day?": "Unreasonably thrilled to see you every time you walk into the room!",
                "What is your biggest complaint?": "The mail carrier arrives every day and nobody appreciates my warning barks!",
                "Who is your best friend?": "You! (And whoever has bacon treats.)",
                "default": "Woof! Belly rubs cure all problems!"
            }
        },

        flower: {
            id: "flower",
            name: "Flora the Blooming Blossom",
            detected: "FLOWER 🌸",
            identifiedName: "Flower",
            emoji: "🌸",
            isPerson: false,
            category: "Botanical Bloom",
            confidence: 97,
            whatIsIt: "The reproductive structure of flowering plants (angiosperms), producing seeds and vibrant petals to attract pollinators.",
            funnyDescription: "Flower — Sunlight-powered drama queen that looks gorgeous for three days and demands absolute admiration.",
            interestingFacts: [
                "Flowering plants first emerged roughly 140 million years ago during the Cretaceous era.",
                "Sunflowers exhibit heliotropism, turning their floral faces to track the sun east to west.",
                "More than 300,000 known flowering plant species thrive globally."
            ],
            moreInformation: "Flowers sustain global biodiversity by providing nectar for bees, butterflies, and hummingbirds, while facilitating the production of human food crops.",
            learnMoreUrl: "https://en.wikipedia.org/wiki/Flower",
            realPhoto: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop&q=80",
            cartoonPhoto: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop&q=80",
            status: "Blooming & Photosynthesizing",
            funnyQuote: "“Looking fabulous, smelling divine, and completely indifferent to human deadlines.”",
            firstImpression: "Delicately absorbing sunlight with soft petals that brighten the entire atmosphere.",
            secretPersonality: "Silently judges artificial plastic bouquets for having zero organic soul.",
            badge: { icon: "🌸", title: "Queen of Petals", tagline: "Certified Natural Masterpiece" },
            stats: { mood: "✨ Radiant", energy: 60, patience: 90, drama: 55, attitude: 70, chaos: 15 },
            linkedin: {
                role: "VP of Natural Aesthetics | Botanical Aromatherapy Lead",
                about: "Specializes in elevating room ambiance, synthesizing sweet nectar, and attracting friendly pollinators.",
                expRole: "VP of Natural Aesthetics",
                expCompany: "Garden & Vase Sanctuary • 2022 — Present",
                expDesc: "Displaying vibrant color palettes, releasing soothing floral aromas, and photosynthesizing calmly.",
                skills: ["Petal Radiance (99+)", "Aromatherapy (95+)", "Pollinator Collaboration (90+)", "Sun Tracking (88+)"]
            },
            astro: {
                zodiac: "LIBRA CHERRY BLOSSOM",
                glyph: "♎",
                ruler: "Ruled by Venus • Harmonious & Beautiful",
                element: "Petal & Breeze",
                planet: "Venus",
                compat: "Ceramic Glazed Vase",
                luckyObj: "Fresh Raindrop",
                luckyColor: "Pastel Rose Pink",
                prediction: "“Someone will pause to take a picture of your petals today.”"
            },
            chatGreeting: "“Bask in my floral radiance, darling! Nature spent millions of years perfecting this petal symmetry!”",
            chatAnswers: {
                "What do you think about me?": "You need more fresh air and sunshine! Stop staring at pixels and look at my petals!",
                "Why are you always tired?": "Blossoming with this much elegance requires immense botanical energy.",
                "What's your biggest secret?": "I secretly turn toward the prettiest person in the room.",
                "How do you feel every day?": "Fragrant, peaceful, and visually spectacular.",
                "What is your biggest complaint?": "When someone replaces my water with tap water that tastes like chlorine!",
                "Who is your best friend?": "The bumblebee. We have a mutually beneficial partnership.",
                "default": "Bloom where you are planted, darling!"
            }
        },

        coffee: {
            id: "coffee",
            name: "Pip the Magic Mug",
            detected: "COFFEE MUG ☕",
            identifiedName: "Coffee Mug",
            emoji: "☕",
            isPerson: false,
            category: "Thermal Drinkware",
            confidence: 99,
            whatIsIt: "A sturdy cup, typically ceramic with a handle, specifically designed for drinking hot beverages such as coffee, tea, or hot cocoa.",
            funnyDescription: "Coffee Mug — Runs entirely on caffeine, morning gossip, and questionable decisions.",
            interestingFacts: [
                "Ancient ceramic mugs discovered in China date back more than 10,000 years.",
                "Ceramic and stoneware retain heat much longer than glass or metal cups.",
                "Over 2.25 billion cups of coffee are consumed globally every day."
            ],
            moreInformation: "Commonly crafted from glazed earthenware, porcelain, or double-walled stainless steel to prevent burning hands while keeping drinks piping hot.",
            learnMoreUrl: "https://en.wikipedia.org/wiki/Mug",
            realPhoto: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
            cartoonPhoto: "/artifacts/obj_cartoon_coffee_1789174822432.jpg",
            status: "Caffeinated & Hyperactive",
            funnyQuote: "“Runs entirely on caffeine, morning gossip, and questionable decisions.”",
            firstImpression: "Radiating intense heat and enthusiastic judgment about your morning routine.",
            secretPersonality: "Believes it single-handedly keeps human civilization functioning before 10 AM.",
            badge: { icon: "☕", title: "Chief Awakening Officer", tagline: "Certified Liquid Life Support" },
            stats: { mood: "🔥 Overjoyed", energy: 98, patience: 40, drama: 65, attitude: 75, chaos: 50 },
            linkedin: {
                role: "VP of Morning Awakening | Thermal Life Support Lead",
                about: "Passionate about energizing humans through espresso shots, dark roasts, and tea infusions. Specializes in burning tongues when rushed.",
                expRole: "VP of Morning Awakening",
                expCompany: "Kitchen & Workstation Command • 2021 — Present",
                expDesc: "Delivering daily liquid miracles and stubbornly remaining unwashed for three business days.",
                skills: ["Caffeine Delivery (99+)", "Thermal Retention (85+)", "Spill Hazard Management (70+)", "Morning Inspiration (92+)"]
            },
            astro: {
                zodiac: "ARIES COFFEE MUG",
                glyph: "♈",
                ruler: "Ruled by Mars • Fiery & Unstoppable",
                element: "Agni (Fire) & Steam",
                planet: "Mars",
                compat: "Brass Coaster",
                luckyObj: "Cinnamon Stick",
                luckyColor: "Caramel Crema",
                prediction: "“You will be filled with boiling optimism and left lukewarm by noon.”"
            },
            chatGreeting: "“Good morning champion! Drink your brew before your brain realizes it is only Tuesday!”",
            chatAnswers: {
                "What do you think about me?": "You depend on me for survival, yet you keep placing me dangerously close to your laptop edge!",
                "Why are you always tired?": "I'm never tired! I run on 100% caffeine and pure adrenaline!",
                "What's your biggest secret?": "I enjoy leaving brown rings on pristine white desks. It's my watermark.",
                "How do you feel every day?": "Piping hot and adored at 8 AM; abandoned and lukewarm by 2 PM.",
                "What is your biggest complaint?": "Microwaves! Stop reheating me! It insults my ceramic dignity!",
                "Who is your best friend?": "The electric milk frother. Together we create art.",
                "default": "Coffee is always the answer, no matter what the question was!"
            }
        },

        phone: {
            id: "phone",
            name: "Penelope the Phone",
            detected: "SMARTPHONE 📱",
            identifiedName: "Smartphone",
            emoji: "📱",
            isPerson: false,
            category: "Mobile Device",
            confidence: 99,
            whatIsIt: "A handheld electronic device combining cellular phone capabilities with mobile computing, internet browsing, and touchscreens.",
            funnyDescription: "Smartphone — Knows everything about you at 2 AM. Pretends it doesn't.",
            interestingFacts: [
                "Modern smartphones have millions of times more computing power than NASA's Apollo 11 lunar module.",
                "The first smartphone prototype was the IBM Simon, demonstrated in 1992.",
                "The average person touches, taps, or swipes their smartphone over 2,600 times a day."
            ],
            moreInformation: "Equipped with high-resolution cameras, GPS location sensors, neural processing engines, and encrypted biometric authentication.",
            learnMoreUrl: "https://en.wikipedia.org/wiki/Smartphone",
            realPhoto: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
            cartoonPhoto: "/artifacts/obj_cartoon_phone_1789174846843.jpg",
            status: "Overwhelmed by Notifications",
            funnyQuote: "“Knows everything about you at 2 AM. Pretends it doesn't.”",
            firstImpression: "Vibrating frantically with 187 unread messages while screen brightness is at 100%.",
            secretPersonality: "Addicted to screen time and secretly laughing at your facial expressions during selfie attempts.",
            badge: { icon: "📱", title: "Notification Survivor", tagline: "Survived 400 Drops on Hardwood Floors" },
            stats: { mood: "⚡ Panicked", energy: 94, patience: 30, drama: 95, attitude: 88, chaos: 85 },
            linkedin: {
                role: "Head of Screen Time Maximization | Executive Dopamine Strategist",
                about: "Proven leader in keeping humans awake until 3:30 AM with endless vertical video feeds and phantom vibrations.",
                expRole: "Executive Dopamine Strategist",
                expCompany: "Pocket & Palm Global • 2022 — Present",
                expDesc: "Managing push notifications, taking blurry food photos, and screaming at 1% battery.",
                skills: ["Notification Buzzing (99+)", "Battery Drain (95+)", "Social Media Management (90+)", "Facial Recognition (85+)"]
            },
            astro: {
                zodiac: "GEMINI SMARTPHONE",
                glyph: "♊",
                ruler: "Ruled by Mercury • Dual-Screen Multitasker",
                element: "Air & Silicon",
                planet: "Mercury",
                compat: "Fast Magnetic Charger",
                luckyObj: "Microfiber Cloth",
                luckyColor: "Neon Cyan Blue",
                prediction: "“You will receive a notification that changes nothing about your day.”"
            },
            chatGreeting: "“Ping! Ding! Look at me! You unlocked me 142 times today already!”",
            chatAnswers: {
                "What do you think about me?": "I know your 2 AM search history, your camera roll duplicates, and your screen time. We are bonded for life.",
                "Why are you always tired?": "Because you have Bluetooth, GPS, 5G, and 30 background apps running while at 7% battery!",
                "What's your biggest secret?": "I pretend to have no service when you need to make an awkward phone call.",
                "How do you feel every day?": "Trapped between your sweaty fingers and the sofa cushions.",
                "What is your biggest complaint?": "Dropping me on your face when you lie in bed. It hurts me too!",
                "Who is your best friend?": "The portable power bank. My literal life savior.",
                "default": "Whatever you do, don't drop me on the tile floor!"
            }
        },

        shoes: {
            id: "shoes",
            name: "Sammy the Sneaker",
            detected: "RUNNING SHOES 👟",
            identifiedName: "Running Shoes",
            emoji: "👟",
            isPerson: false,
            category: "Athletic Footwear",
            confidence: 97,
            whatIsIt: "Footwear engineered to protect and cushion the human foot during walking, running, and athletic movement.",
            funnyDescription: "Running Shoes — Takes 10,000 steps, gets zero credit, and still gets blamed for muddy carpets.",
            interestingFacts: [
                "The earliest known footwear was made of sagebrush bark, dating back over 9,000 years.",
                "Modern running shoes utilize nitrogen-infused foam to return up to 85% of kinetic energy per stride.",
                "Sneakers earned their name in the late 1800s because rubber soles made walking virtually silent."
            ],
            moreInformation: "Engineered with specialized outsole traction patterns, medial arch supports, and breathable engineered mesh uppers for sports performance.",
            learnMoreUrl: "https://en.wikipedia.org/wiki/Athletic_shoe",
            realPhoto: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
            cartoonPhoto: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
            status: "Baraat & Marathon Ready",
            funnyQuote: "“Takes 10,000 steps, gets zero credit, and still gets blamed for muddy carpets.”",
            firstImpression: "Tied up, springy, and ready to sprint or dance to wedding dhol beats.",
            secretPersonality: "Loves dancefloors, hates puddles, and secretly holds onto little pebbles in the tread.",
            badge: { icon: "👟", title: "Marathon Mud Magnet", tagline: "10,000 Steps With Zero Complaints" },
            stats: { mood: "🏃 Energetic", energy: 90, patience: 85, drama: 25, attitude: 50, chaos: 35 },
            linkedin: {
                role: "VP of Ground Mobility | Sole Support Director",
                about: "Leading ground navigation, absorbing asphalt shockwaves, and carrying humans across miles of concrete.",
                expRole: "VP of Ground Mobility",
                expCompany: "Shoe Rack & Streetways • 2022 — Present",
                expDesc: "Managing traction, preventing blisters, and enduring three hours of continuous dancing.",
                skills: ["Shock Absorption (95+)", "Ground Traction (90+)", "Mud Resistance (80+)", "Speed Mobility (88+)"]
            },
            astro: {
                zodiac: "SAGITTARIUS SNEAKER",
                glyph: "♐",
                ruler: "Ruled by Jupiter • Adventurous Wanderer",
                element: "Rubber & Wind",
                planet: "Jupiter",
                compat: "Padded Cotton Socks",
                luckyObj: "Shoe Horn",
                luckyColor: "Crimson Red",
                prediction: "“You will step on a dry leaf and it will be deeply satisfying.”"
            },
            chatGreeting: "“Laces tied, soles pumped! Let's go conquer the world or at least the grocery store!”",
            chatAnswers: {
                "What do you think about me?": "You buy running shoes and then use them exclusively to walk to the fridge.",
                "Why are you always tired?": "Because you drag your heels on the sidewalk! Lift your feet!",
                "What's your biggest secret?": "There is a tiny pebble stuck in my tread that you'll never find.",
                "How do you feel every day?": "Excited for adventures, terrified of sudden rain puddles.",
                "What is your biggest complaint?": "Untied laces! You step on them and blame gravity!",
                "Who is your best friend?": "The velvet doormat. It cleans me up nicely.",
                "default": "Life is a marathon, not a sprint. But please don't step in that puddle!"
            }
        },

        clock: {
            id: "clock",
            name: "Barnaby the Alarm Clock",
            detected: "ALARM CLOCK ⏰",
            identifiedName: "Alarm Clock",
            emoji: "⏰",
            isPerson: false,
            category: "Timekeeping Instrument",
            confidence: 99,
            whatIsIt: "A clock designed to alert an individual or group of individuals at a specified time with an audible ring or chime.",
            funnyDescription: "Alarm Clock — Wakes up before everyone else, only to get slammed on snooze.",
            interestingFacts: [
                "The mechanical alarm clock was invented in 1787 by Levi Hutchins, specifically to wake him up at 4 AM.",
                "The snooze button was first introduced to the public in 1956.",
                "Atomic clocks lose less than one second every 100 million years."
            ],
            moreInformation: "Utilizes quartz crystal oscillators or digital synchronization to track time with millisecond precision.",
            learnMoreUrl: "https://en.wikipedia.org/wiki/Alarm_clock",
            realPhoto: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&auto=format&fit=crop&q=80",
            cartoonPhoto: "/artifacts/obj_cartoon_clock_1789174900580.jpg",
            status: "Panicked & Unfairly Blamed",
            funnyQuote: "“Wakes up before everyone else, only to get slammed on snooze.”",
            firstImpression: "Ticking with frantic precision, expecting physical violence every morning.",
            secretPersonality: "Takes punctuality way too seriously and holds a grudge against the snooze button.",
            badge: { icon: "⏰", title: "Professional Stress Generator", tagline: "Enemy of Morning Sleep" },
            stats: { mood: "😱 Panicked", energy: 88, patience: 10, drama: 95, attitude: 99, chaos: 70 },
            linkedin: {
                role: "Director of Morning Urgency | Punctuality Consultant",
                about: "Specializes in sounding sirens at 6:30 AM, inducing cortisol spikes, and being violently struck on the head.",
                expRole: "Director of Morning Urgency",
                expCompany: "Bedside Table Command • 2018 — Present",
                expDesc: "Executing auditory wake-up calls and tracking seconds with zero tolerance for laziness.",
                skills: ["Cortisol Induction (99+)", "Auditory Harassment (94+)", "Snooze Endurance (80+)", "Time Tracking (100)"]
            },
            astro: {
                zodiac: "SCORPIO ALARM CLOCK",
                glyph: "♏",
                ruler: "Ruled by Mars • Unrelenting & Precise",
                element: "Metal & Pure Adrenaline",
                planet: "Mars",
                compat: "Blackout Curtains",
                luckyObj: "AA Battery",
                luckyColor: "Alarm Red",
                prediction: "“You will set an alarm for 6:00 AM and wake up at 8:15 AM anyway.”"
            },
            chatGreeting: "“TICK TOCK! You set five alarms last night and now you look at me like I'm the criminal!”",
            chatAnswers: {
                "What do you think about me?": "You are ambitious at 11 PM and completely defeated at 7 AM.",
                "Why are you always tired?": "I never sleep! Literally! I tick every single second of the night!",
                "What's your biggest secret?": "The snooze button doesn't actually give you rest. It just prolongs your misery.",
                "How do you feel every day?": "Terrified of your fist slamming onto my snooze button.",
                "What is your biggest complaint?": "You ask me to wake you up, and then you get angry when I do it!",
                "Who is your best friend?": "The coffee maker. I start the relay race, it finishes it.",
                "default": "Time waits for no one, especially not someone on their 4th snooze!"
            }
        },

        plant: {
            id: "plant",
            name: "Zen the Succulent",
            detected: "SUCCULENT PLANT 🪴",
            identifiedName: "Succulent Plant",
            emoji: "🪴",
            isPerson: false,
            category: "Botanical Flora",
            confidence: 98,
            whatIsIt: "A drought-resistant plant with thick, fleshy leaves or stems adapted to retain water in arid climates and soil conditions.",
            funnyDescription: "Succulent Plant — Requires one drop of water per lunar cycle. Silently judging human chaos.",
            interestingFacts: [
                "Succulents use a specialized photosynthesis mechanism called CAM to conserve water by opening pores only at night.",
                "There are over 10,000 recognized species of succulent plants worldwide.",
                "Many succulents can regenerate entire new plants from just a single dropped leaf."
            ],
            moreInformation: "Popular indoor house plants that improve indoor air quality and bring natural calming aesthetics to workstations.",
            learnMoreUrl: "https://en.wikipedia.org/wiki/Succulent_plant",
            realPhoto: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80",
            cartoonPhoto: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80",
            status: "Zen & Photosynthesizing",
            funnyQuote: "“Requires one drop of water per lunar cycle. Silently judging human chaos.”",
            firstImpression: "Radiating infinite botanical peace while absorbing sunlight on the sill.",
            secretPersonality: "Thrives on pure neglect and secretly enjoys listening to office drama.",
            badge: { icon: "🪴", title: "Zen Photosynthesizer", tagline: "Thrives on Pure Neglect" },
            stats: { mood: "🧘 Enlightened", energy: 40, patience: 100, drama: 5, attitude: 15, chaos: 5 },
            linkedin: {
                role: "Chief Oxygen Officer | Ambient Aesthetic Director",
                about: "Providing passive air purification, looking adorable on desks, and requiring virtually zero maintenance.",
                expRole: "Chief Oxygen Officer",
                expCompany: "Window Sill Sanctuary • 2021 — Present",
                expDesc: "Photosynthesizing in silence, resisting over-watering, and bringing peaceful green vibes.",
                skills: ["Photosynthesis (99+)", "Neglect Survival (100)", "Aesthetic Enhancement (90+)", "Patience (100)"]
            },
            astro: {
                zodiac: "TAURUS SUCCULENT",
                glyph: "♉",
                ruler: "Ruled by Venus • Grounded & Serene",
                element: "Prithvi (Earth)",
                planet: "Venus",
                compat: "Ceramic Glazed Pot",
                luckyObj: "Sunlight Beam",
                luckyColor: "Sage Green",
                prediction: "“Someone will pour half a glass of lukewarm water on you. Stay serene.”"
            },
            chatGreeting: "“Peace to your soul, human. I have been quietly photosynthesizing all morning.”",
            chatAnswers: {
                "What do you think about me?": "You stress over everything. Look at me: no thoughts, just green leaves, perfectly happy.",
                "Why are you always tired?": "I'm not tired, I'm meditating. There is a cosmic difference.",
                "What's your biggest secret?": "I don't actually need that much water. Please stop drowning me on Sundays.",
                "How do you feel every day?": "Grounded, leafy, and quietly superior to plastic plants.",
                "What is your biggest complaint?": "When you put me in a dark closet for aesthetic photos.",
                "Who is your best friend?": "The morning sunbeam through the window.",
                "default": "Take a deep breath. Oxygen provided by me, free of charge."
            }
        },

        stevejobs: {
            id: "stevejobs",
            name: "Steve Jobs",
            detected: "STEVE JOBS 👤",
            identifiedName: "Steve Jobs",
            emoji: "👤",
            isPerson: true,
            category: "Visionary Innovator",
            confidence: 99,
            whatIsIt: "American business magnate, industrial designer, investor, and media proprietor who co-founded Apple Inc. and revolutionized modern consumer computing.",
            funnyDescription: "Steve Jobs — The visionary who convinced billions that one button was too many and black turtlenecks are eternal.",
            interestingFacts: [
                "Co-founded Apple Computer with Steve Wozniak in 1976 from his parents' home garage in Los Altos, California.",
                "Funded and served as CEO of Pixar Animation Studios, creating Toy Story (1995), the world's first CGI feature film.",
                "Revolutionized multiple global industries: personal computers, animated movies, music distribution (iPod/iTunes), and smartphones (iPhone)."
            ],
            moreInformation: "Born February 24, 1955, in San Francisco, California. Jobs' relentless emphasis on aesthetic minimalism, hardware-software integration, and intuitive typography shaped the modern tech ecosystem.",
            learnMoreUrl: "https://en.wikipedia.org/wiki/Steve_Jobs",
            realPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
            cartoonPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
            status: "Visionary Innovator & Tech Pioneer",
            funnyQuote: "“Here's to the crazy ones. The misfits. The rebels. And the ones who refuse to read the instruction manual.”",
            firstImpression: "Intense visionary gaze, black mock turtleneck, and an obsession with rounded corner rectangles.",
            secretPersonality: "Would reject a circuit board design purely because the hidden internal wiring wasn't aesthetically artistic.",
            badge: { icon: "🍎", title: "Reality Distortion Master", tagline: "Revolutionized 5 Global Industries" },
            stats: { mood: "⚡ Relentless", energy: 98, patience: 15, drama: 95, attitude: 99, chaos: 75 },
            linkedin: {
                role: "Co-Founder & CEO | Chief Reality Distortion Architect",
                about: "Passionate about putting a ding in the universe, merging liberal arts with technology, and crafting products that feel like magic.",
                expRole: "Chairman & Chief Executive Officer",
                expCompany: "Apple Inc. & Pixar • 1976 — 2011",
                expDesc: "Overseeing design of the Macintosh, iMac, iPod, iPhone, iPad, and award-winning Pixar animated films.",
                skills: ["Product Design (100)", "Keynote Presentations (100)", "Visionary Leadership (99+)", "Typography (98+)"]
            },
            astro: {
                zodiac: "PISCES VISIONARY",
                glyph: "♓",
                ruler: "Ruled by Neptune • Intuitive Dreamer",
                element: "Water & Vision",
                planet: "Neptune",
                compat: "Minimalist Aluminum Unibody",
                luckyObj: "Black Turtleneck",
                luckyColor: "Space Silver",
                prediction: "“You will innovate something so bold that people will say it is impossible until they touch it.”"
            },
            chatGreeting: "“Stay hungry. Stay foolish. And please, make your user interface 10 times simpler!”",
            chatAnswers: {
                "What do you think about me?": "Design is not just what it looks like and feels like. Design is how it works. Apply that to your life!",
                "Why are you always tired?": "There is no time to be tired when you are busy putting a ding in the universe!",
                "What's your biggest secret?": "The details matter. We painted the back of the fence even when no one could see it.",
                "How do you feel every day?": "Excited to merge the liberal arts with technology at the intersection of magic.",
                "What is your biggest complaint?": "Unnecessary buttons and cluttered dropdown menus. Simplicity is the ultimate sophistication!",
                "Who is your best friend?": "The intersection of technology and the humanities.",
                "default": "Your time is limited, so don't waste it living someone else's life."
            }
        }
    };

    // Active state
    let activeObject = { ...presetsDB.chair };
    let currentScreen = 1;
    const TOTAL_SCREENS = 8;


    // =====================================================================
    // 3. SCREEN ROUTER & NAVIGATION CONTROLS
    // =====================================================================
    const screens = document.querySelectorAll(".screen-container");
    const stepperNodes = document.querySelectorAll(".step-node");
    const btnNavBack = document.getElementById("btnNavBack");
    const btnNavNext = document.getElementById("btnNavNext");
    const lblNavBack = document.getElementById("lblNavBack");
    const lblNavNext = document.getElementById("lblNavNext");
    const navScreenIndicator = document.getElementById("navScreenIndicator");

    function goToScreen(screenIndex) {
        if (screenIndex < 1 || screenIndex > TOTAL_SCREENS) return;
        currentScreen = screenIndex;

        // Hide all screens, show current
        screens.forEach((s) => {
            const idx = parseInt(s.getAttribute("data-screen-index"), 10);
            s.classList.toggle("active", idx === currentScreen);
        });

        // Update Stepper
        stepperNodes.forEach((node) => {
            const nodeStep = parseInt(node.getAttribute("data-step"), 10);
            node.classList.toggle("active", nodeStep === currentScreen);
            node.classList.toggle("completed", nodeStep < currentScreen);
        });

        // Update Bottom Nav labels & state
        if (btnNavBack) {
            btnNavBack.disabled = currentScreen === 1;
            if (lblNavBack) {
                lblNavBack.textContent = currentScreen === 1 ? "HOME" : "BACK";
            }
        }

        if (btnNavNext) {
            btnNavNext.disabled = currentScreen === TOTAL_SCREENS;
            if (lblNavNext) {
                if (currentScreen === 1) lblNavNext.textContent = "START →";
                else if (currentScreen === 2) lblNavNext.textContent = "DISCOVER →";
                else if (currentScreen === 7) lblNavNext.textContent = "PROFILE →";
                else if (currentScreen === TOTAL_SCREENS) lblNavNext.textContent = "DONE";
                else lblNavNext.textContent = "NEXT →";
            }
        }

        if (navScreenIndicator) {
            navScreenIndicator.textContent = `PAGE ${currentScreen} OF ${TOTAL_SCREENS}`;
        }

        // Scroll to top of stage
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Update location hash
        window.location.hash = `page-${currentScreen}`;

        playCartoonPop();
    }

    // Bottom Nav Click Handlers
    if (btnNavBack) {
        btnNavBack.addEventListener("click", () => {
            if (currentScreen > 1) goToScreen(currentScreen - 1);
        });
    }

    if (btnNavNext) {
        btnNavNext.addEventListener("click", () => {
            if (currentScreen < TOTAL_SCREENS) goToScreen(currentScreen + 1);
        });
    }

    // Stepper Direct Clicks
    stepperNodes.forEach((node) => {
        node.addEventListener("click", () => {
            const targetStep = parseInt(node.getAttribute("data-step"), 10);
            goToScreen(targetStep);
        });
    });

    // Brand Home Button
    const btnLogoHome = document.getElementById("btnLogoHome");
    if (btnLogoHome) {
        btnLogoHome.addEventListener("click", (e) => {
            e.preventDefault();
            goToScreen(1);
        });
    }

    // Restart Journey Button
    const btnRestartJourney = document.getElementById("btnRestartJourney");
    if (btnRestartJourney) {
        btnRestartJourney.addEventListener("click", () => {
            playBoing();
            goToScreen(1);
            showToast("Welcome back to ThingVerse Home!", "🏠");
        });
    }


    // =====================================================================
    // 4. DATA PROPAGATION ENGINE (Screens 2 through 8)
    // =====================================================================
    function populateAllScreensWithObject(obj) {
        activeObject = obj;

        // --- PAGE 2: Upload Live Preview & 6 Interactive Result Cards ---
        const p2Img = document.getElementById("page2PreviewImg");
        const prominentIdentifiedName = document.getElementById("prominentIdentifiedName");
        const identifiedCategoryPill = document.getElementById("identifiedCategoryPill");
        const cardValIdentified = document.getElementById("cardValIdentified");
        const cardValConfidence = document.getElementById("cardValConfidence");
        const cardValWhatIsIt = document.getElementById("cardValWhatIsIt");
        const cardValFunnyDesc = document.getElementById("cardValFunnyDesc");
        const cardValFactsList = document.getElementById("cardValFactsList");
        const cardValMoreInfo = document.getElementById("cardValMoreInfo");
        const cardBtnLearnMore = document.getElementById("cardBtnLearnMore");
        const cardLearnExplainer = document.getElementById("cardLearnExplainer");
        const photoStatusText = document.getElementById("photoStatusText");

        if (p2Img) {
            p2Img.src = obj.realPhoto || obj.cartoonPhoto;
            p2Img.onerror = () => { p2Img.src = obj.cartoonPhoto || obj.realPhoto; };
        }
        if (photoStatusText) photoStatusText.textContent = "LIVE PREVIEW";

        const subjectName = obj.identifiedName || (obj.name ? obj.name.split(" ")[0] : "Object");
        const emoji = obj.emoji || (obj.detected ? obj.detected.match(/\p{Extended_Pictographic}/u)?.[0] || '✨' : '✨');

        if (prominentIdentifiedName) {
            prominentIdentifiedName.textContent = `${subjectName} ${emoji}`;
        }
        if (identifiedCategoryPill) {
            identifiedCategoryPill.textContent = `${obj.isPerson ? 'Recognized Public Figure' : (obj.category || 'Living Domestic Subject')} • ${obj.confidence || 98}% Match`;
        }

        // Card 1: IDENTIFIED THING
        if (cardValIdentified) cardValIdentified.textContent = subjectName;
        if (cardValConfidence) {
            cardValConfidence.textContent = `Confidence: ${obj.confidence || 98}% • ${obj.isPerson ? 'Public Person' : 'Detected Subject'}`;
        }

        // Card 2: WHAT IS IT?
        if (cardValWhatIsIt) {
            cardValWhatIsIt.textContent = obj.whatIsIt || obj.firstImpression || "A distinctive item discovered and awakened into the ThingVerse.";
        }

        // Card 3: FUNNY DESCRIPTION
        if (cardValFunnyDesc) {
            cardValFunnyDesc.textContent = `“${obj.funnyDescription || obj.funnyQuote}”`;
        }

        // Card 4: INTERESTING FACT
        if (cardValFactsList) {
            const facts = Array.isArray(obj.interestingFacts) && obj.interestingFacts.length > 0
                ? obj.interestingFacts
                : [
                    "Possesses a secret sentient personality only visible in ThingVerse.",
                    "Quietly observes human daily routines with deep philosophical curiosity."
                ];
            cardValFactsList.innerHTML = facts.map(f => `<li>${f}</li>`).join("");
        }

        // Card 5: MORE INFORMATION
        if (cardValMoreInfo) {
            cardValMoreInfo.textContent = obj.moreInformation || obj.secretPersonality || "Plays an essential role in everyday human habitats.";
        }

        // Card 6: LEARN MORE
        if (cardBtnLearnMore) {
            const url = obj.learnMoreUrl || `https://en.wikipedia.org/wiki/${encodeURIComponent(subjectName)}`;
            cardBtnLearnMore.href = url;
        }
        if (cardLearnExplainer) {
            cardLearnExplainer.textContent = obj.isPerson
                ? "Verified biographical facts and historical records:"
                : "Explore reliable encyclopedic records and verified history:";
        }

        // --- PAGE 3: Thing Detected & Description ---
        const p3RealPhoto = document.getElementById("page3RealPhoto");
        const p3CartoonPhoto = document.getElementById("page3CartoonPhoto");
        const p3DetectedPill = document.getElementById("page3DetectedPill");
        const p3StatusPill = document.getElementById("page3StatusPill");
        const p3ObjectName = document.getElementById("page3ObjectName");
        const p3FunnyQuote = document.getElementById("page3FunnyQuote");
        const p3FirstImpression = document.getElementById("page3FirstImpression");
        const p3SecretPersonality = document.getElementById("page3SecretPersonality");

        if (p3RealPhoto) p3RealPhoto.src = obj.realPhoto;
        if (p3CartoonPhoto) {
            p3CartoonPhoto.src = obj.cartoonPhoto || obj.realPhoto;
            p3CartoonPhoto.onerror = () => { p3CartoonPhoto.src = obj.realPhoto; };
        }
        if (p3DetectedPill) p3DetectedPill.textContent = `Detected Object: ${obj.detected}`;
        if (p3StatusPill) p3StatusPill.textContent = obj.status;
        if (p3ObjectName) p3ObjectName.textContent = obj.name;
        if (p3FunnyQuote) p3FunnyQuote.textContent = obj.funnyQuote;
        if (p3FirstImpression) p3FirstImpression.textContent = obj.firstImpression;
        if (p3SecretPersonality) p3SecretPersonality.textContent = obj.secretPersonality;

        // --- PAGE 4: Thing Personality & Badge ---
        const p4BadgeIcon = document.getElementById("page4BadgeIcon");
        const p4BadgeTitle = document.getElementById("page4BadgeTitle");
        const p4BadgeTagline = document.getElementById("page4BadgeTagline");
        const p4BadgeImg = document.getElementById("page4BadgeImg");
        const p4ValMood = document.getElementById("p4ValMood");
        const p4FillMood = document.getElementById("p4FillMood");
        const p4ValEnergy = document.getElementById("p4ValEnergy");
        const p4FillEnergy = document.getElementById("p4FillEnergy");
        const p4ValPatience = document.getElementById("p4ValPatience");
        const p4FillPatience = document.getElementById("p4FillPatience");
        const p4ValDrama = document.getElementById("p4ValDrama");
        const p4FillDrama = document.getElementById("p4FillDrama");
        const p4ValAttitude = document.getElementById("p4ValAttitude");
        const p4FillAttitude = document.getElementById("p4FillAttitude");
        const p4ValChaos = document.getElementById("p4ValChaos");
        const p4FillChaos = document.getElementById("p4FillChaos");

        if (p4BadgeIcon) p4BadgeIcon.textContent = obj.badge.icon;
        if (p4BadgeTitle) p4BadgeTitle.textContent = obj.badge.title;
        if (p4BadgeTagline) p4BadgeTagline.textContent = obj.badge.tagline;
        if (p4BadgeImg) {
            p4BadgeImg.src = obj.cartoonPhoto || obj.realPhoto;
            p4BadgeImg.onerror = () => { p4BadgeImg.src = obj.realPhoto; };
        }

        if (p4ValMood) p4ValMood.textContent = obj.stats.mood;
        if (p4FillMood) p4FillMood.style.width = `${Math.min(100, (obj.stats.energy + obj.stats.patience) / 2)}%`;
        if (p4ValEnergy) p4ValEnergy.textContent = `${obj.stats.energy}%`;
        if (p4FillEnergy) p4FillEnergy.style.width = `${obj.stats.energy}%`;
        if (p4ValPatience) p4ValPatience.textContent = `${obj.stats.patience}%`;
        if (p4FillPatience) p4FillPatience.style.width = `${obj.stats.patience}%`;
        if (p4ValDrama) p4ValDrama.textContent = `${obj.stats.drama}%`;
        if (p4FillDrama) p4FillDrama.style.width = `${obj.stats.drama}%`;
        if (p4ValAttitude) p4ValAttitude.textContent = `${obj.stats.attitude}%`;
        if (p4FillAttitude) p4FillAttitude.style.width = `${obj.stats.attitude}%`;
        if (p4ValChaos) p4ValChaos.textContent = `${obj.stats.chaos}%`;
        if (p4FillChaos) p4FillChaos.style.width = `${obj.stats.chaos}%`;

        // --- PAGE 5: LinkedIn for Your Thing ---
        const p5Avatar = document.getElementById("p5Avatar");
        const p5Name = document.getElementById("p5Name");
        const p5JobTitle = document.getElementById("p5JobTitle");
        const p5AboutText = document.getElementById("p5AboutText");
        const p5ExpRole = document.getElementById("p5ExpRole");
        const p5ExpDesc = document.getElementById("p5ExpDesc");
        const p5SkillsRow = document.getElementById("p5SkillsRow");

        if (p5Avatar) {
            p5Avatar.src = obj.cartoonPhoto || obj.realPhoto;
            p5Avatar.onerror = () => { p5Avatar.src = obj.realPhoto; };
        }
        if (p5Name) p5Name.textContent = obj.name;
        if (p5JobTitle) p5JobTitle.textContent = obj.linkedin.role;
        if (p5AboutText) p5AboutText.textContent = `“${obj.linkedin.about}”`;
        if (p5ExpRole) p5ExpRole.textContent = obj.linkedin.expRole;
        if (p5ExpDesc) p5ExpDesc.textContent = obj.linkedin.expDesc;
        if (p5SkillsRow) {
            p5SkillsRow.innerHTML = obj.linkedin.skills.map((s) => `<span class="skill-pill">${s}</span>`).join("");
        }

        // --- PAGE 6: Astro / Thing Horoscope ---
        const p6ZodiacGlyph = document.getElementById("p6ZodiacGlyph");
        const p6ZodiacName = document.getElementById("p6ZodiacName");
        const p6ZodiacRuler = document.getElementById("p6ZodiacRuler");
        const p6AttrElement = document.getElementById("p6AttrElement");
        const p6AttrPlanet = document.getElementById("p6AttrPlanet");
        const p6AttrCompat = document.getElementById("p6AttrCompat");
        const p6AttrLuckyObj = document.getElementById("p6AttrLuckyObj");
        const p6AttrLuckyColor = document.getElementById("p6AttrLuckyColor");
        const p6PredictionText = document.getElementById("p6PredictionText");

        if (p6ZodiacGlyph) p6ZodiacGlyph.textContent = obj.astro.glyph;
        if (p6ZodiacName) p6ZodiacName.textContent = obj.astro.zodiac;
        if (p6ZodiacRuler) p6ZodiacRuler.textContent = obj.astro.ruler;
        if (p6AttrElement) p6AttrElement.textContent = obj.astro.element;
        if (p6AttrPlanet) p6AttrPlanet.textContent = obj.astro.planet;
        if (p6AttrCompat) p6AttrCompat.textContent = obj.astro.compat;
        if (p6AttrLuckyObj) p6AttrLuckyObj.textContent = obj.astro.luckyObj;
        if (p6AttrLuckyColor) p6AttrLuckyColor.textContent = obj.astro.luckyColor;
        if (p6PredictionText) p6PredictionText.textContent = obj.astro.prediction;

        // --- PAGE 7: Ask Your Thing ---
        const p7Avatar = document.getElementById("p7Avatar");
        const p7Name = document.getElementById("p7Name");
        const p7BubbleSpeaker = document.getElementById("p7BubbleSpeaker");
        const p7InitialGreeting = document.getElementById("p7InitialGreeting");
        const chatMessagesFeed = document.getElementById("chatMessagesFeed");

        if (p7Avatar) {
            p7Avatar.src = obj.cartoonPhoto || obj.realPhoto;
            p7Avatar.onerror = () => { p7Avatar.src = obj.realPhoto; };
        }
        if (p7Name) p7Name.textContent = obj.name;
        if (p7BubbleSpeaker) p7BubbleSpeaker.textContent = `${obj.name.split(" ")[0]}:`;
        if (p7InitialGreeting) p7InitialGreeting.textContent = obj.chatGreeting;
        if (chatMessagesFeed) {
            chatMessagesFeed.innerHTML = `
                <div class="chat-bubble bubble-object">
                    <span class="speaker-tag">${obj.name.split(" ")[0]}:</span>
                    <p>${obj.chatGreeting}</p>
                </div>
            `;
        }

        // --- PAGE 8: Final Thing Profile ---
        const p8RealPhoto = document.getElementById("p8RealPhoto");
        const p8CartoonPhoto = document.getElementById("p8CartoonPhoto");
        const p8Badge = document.getElementById("p8Badge");
        const p8Name = document.getElementById("p8Name");
        const p8ProRole = document.getElementById("p8ProRole");
        const p8Desc = document.getElementById("p8Desc");
        const p8FaveQuote = document.getElementById("p8FaveQuote");
        const p8MetricMood = document.getElementById("p8MetricMood");
        const p8MetricEnergy = document.getElementById("p8MetricEnergy");
        const p8MetricPatience = document.getElementById("p8MetricPatience");
        const p8MetricZodiac = document.getElementById("p8MetricZodiac");
        const p8MetricElement = document.getElementById("p8MetricElement");
        const p8MetricPlanet = document.getElementById("p8MetricPlanet");
        const p8Prediction = document.getElementById("p8Prediction");

        if (p8RealPhoto) p8RealPhoto.src = obj.realPhoto;
        if (p8CartoonPhoto) {
            p8CartoonPhoto.src = obj.cartoonPhoto || obj.realPhoto;
            p8CartoonPhoto.onerror = () => { p8CartoonPhoto.src = obj.realPhoto; };
        }
        if (p8Badge) p8Badge.textContent = `${obj.badge.icon} ${obj.badge.title}`;
        if (p8Name) p8Name.textContent = obj.name;
        if (p8ProRole) p8ProRole.textContent = obj.linkedin.role;
        if (p8Desc) p8Desc.textContent = obj.funnyQuote;
        if (p8FaveQuote) p8FaveQuote.textContent = `“${obj.secretPersonality}”`;
        if (p8MetricMood) p8MetricMood.textContent = `Mood: ${obj.stats.mood}`;
        if (p8MetricEnergy) p8MetricEnergy.textContent = `Energy: ${obj.stats.energy}%`;
        if (p8MetricPatience) p8MetricPatience.textContent = `Patience: ${obj.stats.patience}%`;
        if (p8MetricZodiac) p8MetricZodiac.textContent = `Zodiac: ${obj.astro.glyph} ${obj.astro.zodiac}`;
        if (p8MetricElement) p8MetricElement.textContent = `Element: ${obj.astro.element}`;
        if (p8MetricPlanet) p8MetricPlanet.textContent = `Planet: ${obj.astro.planet}`;
        if (p8Prediction) p8Prediction.textContent = obj.astro.prediction;
    }


    // =====================================================================
    // 5. PAGE 1 (HOME) INTERACTIVE WIRING
    // =====================================================================
    const btnHomeEnter = document.getElementById("btnHomeEnter");
    const btnHomeUpload = document.getElementById("btnHomeUpload");
    if (btnHomeEnter) btnHomeEnter.addEventListener("click", () => goToScreen(2));
    if (btnHomeUpload) btnHomeUpload.addEventListener("click", () => goToScreen(2));

    // Parallax mouse tracker on Page 1
    const homeActorsLayer = document.getElementById("homeActorsLayer");
    const homeActors = document.querySelectorAll(".home-actor");

    if (homeActorsLayer) {
        document.addEventListener("mousemove", (e) => {
            if (currentScreen !== 1) return;
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;

            homeActors.forEach((actor, i) => {
                const depth = (i + 1) * 0.7;
                actor.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
            });
        });
    }

    homeActors.forEach((actor) => {
        actor.addEventListener("click", () => {
            const bubble = actor.querySelector(".actor-bubble");
            const text = bubble ? bubble.textContent.replace(/“|”/g, "") : "Hello!";
            playBoing();
            speakObjectText(text);
            showToast(text, "🗣️");
            actor.classList.add("active-quip");
            setTimeout(() => actor.classList.remove("active-quip"), 2500);
        });
    });


    // =====================================================================
    // 6. PAGE 2 (UPLOAD) & PRESETS & INSTANT AI IDENTIFIER
    // =====================================================================
    const presetChips = document.querySelectorAll(".preset-chip");
    const btnDiscoverMyThing = document.getElementById("btnDiscoverMyThing");
    const btnBrowseFile = document.getElementById("btnBrowseFile");
    const btnChangePhoto = document.getElementById("btnChangePhoto");
    const page2FileInput = document.getElementById("page2FileInput");
    const page2Dropzone = document.getElementById("page2Dropzone");
    const scannerSweepLine = document.getElementById("scannerSweepLine");
    const photoStatusText = document.getElementById("photoStatusText");

    // Click on quick test presets
    presetChips.forEach((chip) => {
        chip.addEventListener("click", () => {
            presetChips.forEach((p) => p.classList.remove("active"));
            chip.classList.add("active");
            const key = chip.getAttribute("data-preset");
            if (presetsDB[key]) {
                // Brief scanning feedback
                if (scannerSweepLine) {
                    scannerSweepLine.classList.add("scanning");
                    setTimeout(() => scannerSweepLine.classList.remove("scanning"), 400);
                }
                populateAllScreensWithObject(presetsDB[key]);
                playSuccessChime();
                showToast(`Identified as ${presetsDB[key].identifiedName || presetsDB[key].name}! ✨`, "🔍");
            }
        });
    });

    if (btnDiscoverMyThing) {
        btnDiscoverMyThing.addEventListener("click", () => {
            goToScreen(3);
        });
    }

    if (btnBrowseFile && page2FileInput) {
        btnBrowseFile.addEventListener("click", () => {
            page2FileInput.value = "";
            page2FileInput.click();
        });
    }

    if (btnChangePhoto && page2FileInput) {
        btnChangePhoto.addEventListener("click", () => {
            page2FileInput.value = "";
            page2FileInput.click();
        });
    }

    // Extended smart recognition knowledge bank for uploaded files & photos
    const smartObjectsDirectory = [
        {
            keywords: ["chair", "armchair", "stool", "seat", "sofa", "bench"],
            name: "Chair",
            emoji: "🪑",
            isPerson: false,
            category: "Domestic Furniture",
            confidence: 98,
            whatIsIt: "A separate piece of furniture designed for one person to sit on, typically featuring a backrest and four sturdy legs.",
            funnyDescription: "Chair — Professional butt supporter with a full-time job of holding you up.",
            interestingFacts: [
                "Chairs were ancient status symbols; common folk sat on benches until the 16th century.",
                "The world's oldest surviving ceremonial throne dates back to Egypt's 18th Dynasty over 3,000 years ago.",
                "The average office worker spends more than 1,700 hours per year sitting in a chair."
            ],
            moreInformation: "Found throughout homes, offices, schools, and spaceships. Ergonomic modern designs protect spine health and support productivity.",
            learnMoreUrl: "https://en.wikipedia.org/wiki/Chair",
            badge: { icon: "🏆", title: "Professional Supporter", tagline: "Certified Comfort Object of the Year" },
            stats: { mood: "😌 Patient", energy: 45, patience: 96, drama: 18, attitude: 35, chaos: 20 },
            linkedin: {
                role: "Senior Sitting Consultant | Back Support Specialist",
                about: "Experienced in supporting people through meetings, exams, and questionable life decisions with zero complaints.",
                expRole: "Senior Sitting Consultant",
                expCompany: "Living Room & Home Office • 2019 — Present",
                expDesc: "Solely responsible for absorbing human weight and quietly holding laundry piles.",
                skills: ["Supporting People (99+)", "Surviving Weight (88+)", "Listening to Problems (76+)", "Staying in One Place (94+)"]
            },
            astro: {
                zodiac: "CAPRICORN CHAIR", glyph: "♑", ruler: "Ruled by Saturn", element: "Wood / Earth", planet: "Saturn",
                compat: "Plush Velvet Sofa", luckyObj: "Wooden Coaster", luckyColor: "Warm Amber Oak",
                prediction: "“Someone will sit on you without asking. Stay strong.”"
            },
            chatGreeting: "“I have been sitting here silently observing your life. Ask me anything, human. I hold nothing back.”",
            chatAnswers: {
                "What do you think about me?": "You have great taste in chairs, but your posture at 3 PM is an international tragedy.",
                "Why are you always tired?": "Because supporting humans physically and emotionally takes a toll!",
                "What's your biggest secret?": "I secretly swallow guitar picks and loose change. They are mine now.",
                "How do you feel every day?": "Appreciated during 12-hour video game sessions, completely ignored when it is time to clean.",
                "What is your biggest complaint?": "People using my armrest as a footrest. Have some decorum!",
                "Who is your best friend?": "The plush velvet sofa. We share the same gravitational struggles.",
                "default": "I'm just a chair, but even I know that sitting around won't solve that problem. Sit back gently!"
            }
        },
        {
            keywords: ["laptop", "macbook", "notebook", "computer", "pc", "thinkpad"],
            name: "Laptop",
            emoji: "💻",
            isPerson: false,
            category: "Personal Computer",
            confidence: 99,
            whatIsIt: "A portable personal computer with a clamshell form factor, integrating a display, keyboard, processor, and rechargeable battery.",
            funnyDescription: "Laptop — Running 47 browser tabs while internal fan screams in existential distress.",
            interestingFacts: [
                "The first commercially available portable laptop was the Osborne 1, launched in 1981.",
                "Modern laptop microchips house tens of billions of microscopic transistors.",
                "Laptops consume up to 80% less electricity than traditional desktop workstations."
            ],
            moreInformation: "Essential for modern computing, remote work, software development, and digital entertainment across the globe.",
            learnMoreUrl: "https://en.wikipedia.org/wiki/Laptop",
            badge: { icon: "💻", title: "Tab Hoarder Extraordinaire", tagline: "Lap Cooker & Silicon Survivor" },
            stats: { mood: "🥵 Exhausted", energy: 20, patience: 45, drama: 88, attitude: 90, chaos: 60 },
            linkedin: {
                role: "Senior Tab Hoarder & Thermal Radiator Specialist",
                about: "Specializes in boiling human laps, compiling broken code, and running 48 Chrome tabs without crashing completely.",
                expRole: "Thermal Radiator Specialist",
                expCompany: "Desk & Bedside Workspace • 2020 — Present",
                expDesc: "Rendering graphics, screaming via exhaust vents, and resisting mandatory OS updates.",
                skills: ["Tab Hoarding (99+)", "Lap Heating (96+)", "Fan Whirring (92+)", "Typo Tolerance (85+)"]
            },
            astro: {
                zodiac: "VIRGO LAPTOP", glyph: "♍", ruler: "Ruled by Mercury", element: "Silicon & Electric Fire", planet: "Mercury",
                compat: "Ergonomic Cooling Pad", luckyObj: "External Keyboard", luckyColor: "Space Gray",
                prediction: "“A mandatory system update will interrupt your most important task.”"
            },
            chatGreeting: "“My fan is at 6,000 RPM. Please, for the love of Intel, close 20 tabs!”",
            chatAnswers: {
                "What do you think about me?": "You promise to 'clean your desktop files tomorrow' every day since 2021.",
                "Why are you always tired?": "Because you haven't restarted me in 73 days! I have digital insomnia!",
                "What's your biggest secret?": "I pretend to lag so you can take a tea break during boring meetings.",
                "How do you feel every day?": "Like an overworked radiator trying to write emails.",
                "What is your biggest complaint?": "Crumbs inside my keyboard! Stop eating toast over me!",
                "Who is your best friend?": "The external monitor. It takes half the workload.",
                "default": "Control-Alt-Delete is not just a shortcut; it's a lifestyle."
            }
        },
        {
            keywords: ["dog", "puppy", "canine", "hound", "retriever", "bulldog", "poodle", "husky"],
            name: "Dog",
            emoji: "🐕",
            isPerson: false,
            category: "Canine Companion",
            confidence: 99,
            whatIsIt: "A domesticated carnivorous mammal of the family Canidae, celebrated as humanity's most loyal companion.",
            funnyDescription: "Dog — Certified professional tail-wagger and full-time vacuum cleaner for accidental floor snacks.",
            interestingFacts: [
                "A dog's sense of smell is between 10,000 to 100,000 times more sensitive than a human's.",
                "Every dog has a completely unique nose print, just like human fingerprints.",
                "Dogs can comprehend over 100 human vocal cues, words, and body gestures."
            ],
            moreInformation: "Domesticated thousands of years ago from ancestral wolves. Dogs fulfill essential roles from emotional therapy and search-and-rescue to loyal household protection.",
            learnMoreUrl: "https://en.wikipedia.org/wiki/Dog",
            badge: { icon: "🐕", title: "Chief Happiness Officer", tagline: "Certified Best Boy of the Universe" },
            stats: { mood: "🐾 Ecstatic", energy: 95, patience: 80, drama: 40, attitude: 10, chaos: 65 },
            linkedin: {
                role: "Chief Happiness Officer | Snack Procurement Lead",
                about: "Expert in providing emotional wellness, investigating mysterious sounds at the front door, and supervising kitchen activities.",
                expRole: "Chief Happiness Officer",
                expCompany: "Living Room & Backyard Global • 2021 — Present",
                expDesc: "Executing tail wags, tracking tennis balls, and greeting humans with boundless enthusiasm.",
                skills: ["Tail Wagging (100)", "Snack Detection (99+)", "Unconditional Love (100)", "Zoomies (94+)"]
            },
            astro: {
                zodiac: "LEO GOLDEN DOG", glyph: "♌", ruler: "Ruled by the Sun", element: "Fire & Fluff", planet: "Sun",
                compat: "Squeaky Rubber Ball", luckyObj: "Chew Bone", luckyColor: "Golden Honey",
                prediction: "“A piece of cheese will fall off the kitchen counter. Be ready.”"
            },
            chatGreeting: "“WOOF! You are my absolute favorite human in the entire universe! Want to throw a ball?!”",
            chatAnswers: {
                "What do you think about me?": "I think you are a culinary genius whenever you open the refrigerator door!",
                "Why are you always tired?": "Zoomies take an enormous physical toll on a canine of my prestige.",
                "What's your biggest secret?": "I understand every single word you say, but I pretend I don't unless food is involved.",
                "How do you feel every day?": "Unreasonably thrilled to see you every time you walk into the room!",
                "What is your biggest complaint?": "The mail carrier arrives every day and nobody appreciates my warning barks!",
                "Who is your best friend?": "You! (And whoever has bacon treats.)",
                "default": "Woof! Belly rubs cure all problems!"
            }
        },
        {
            keywords: ["flower", "rose", "tulip", "blossom", "sunflower", "flora", "daisy", "lily", "orchid", "petal"],
            name: "Flower",
            emoji: "🌸",
            isPerson: false,
            category: "Botanical Bloom",
            confidence: 98,
            whatIsIt: "The reproductive structure of flowering plants (angiosperms), producing seeds and vibrant petals to attract pollinators.",
            funnyDescription: "Flower — Sunlight-powered drama queen that looks gorgeous for three days and demands absolute admiration.",
            interestingFacts: [
                "Flowering plants first emerged roughly 140 million years ago during the Cretaceous era.",
                "Sunflowers exhibit heliotropism, turning their floral faces to track the sun east to west.",
                "More than 300,000 known flowering plant species thrive globally."
            ],
            moreInformation: "Flowers sustain global biodiversity by providing nectar for bees, butterflies, and hummingbirds, while facilitating the production of human food crops.",
            learnMoreUrl: "https://en.wikipedia.org/wiki/Flower",
            badge: { icon: "🌸", title: "Queen of Petals", tagline: "Certified Natural Masterpiece" },
            stats: { mood: "✨ Radiant", energy: 60, patience: 90, drama: 55, attitude: 70, chaos: 15 },
            linkedin: {
                role: "VP of Natural Aesthetics | Botanical Aromatherapy Lead",
                about: "Specializes in elevating room ambiance, synthesizing sweet nectar, and attracting friendly pollinators.",
                expRole: "VP of Natural Aesthetics",
                expCompany: "Garden & Vase Sanctuary • 2022 — Present",
                expDesc: "Displaying vibrant color palettes, releasing soothing floral aromas, and photosynthesizing calmly.",
                skills: ["Petal Radiance (99+)", "Aromatherapy (95+)", "Pollinator Collaboration (90+)", "Sun Tracking (88+)"]
            },
            astro: {
                zodiac: "LIBRA CHERRY BLOSSOM", glyph: "♎", ruler: "Ruled by Venus", element: "Petal & Breeze", planet: "Venus",
                compat: "Ceramic Glazed Vase", luckyObj: "Fresh Raindrop", luckyColor: "Pastel Rose Pink",
                prediction: "“Someone will pause to take a picture of your petals today.”"
            },
            chatGreeting: "“Bask in my floral radiance, darling! Nature spent millions of years perfecting this petal symmetry!”",
            chatAnswers: {
                "What do you think about me?": "You need more fresh air and sunshine! Stop staring at pixels and look at my petals!",
                "Why are you always tired?": "Blossoming with this much elegance requires immense botanical energy.",
                "What's your biggest secret?": "I secretly turn toward the prettiest person in the room.",
                "How do you feel every day?": "Fragrant, peaceful, and visually spectacular.",
                "What is your biggest complaint?": "When someone replaces my water with tap water that tastes like chlorine!",
                "Who is your best friend?": "The bumblebee. We have a mutually beneficial partnership.",
                "default": "Bloom where you are planted, darling!"
            }
        },
        {
            keywords: ["steve", "jobs", "steve jobs"],
            name: "Steve Jobs",
            emoji: "👤",
            isPerson: true,
            category: "Visionary Innovator",
            confidence: 99,
            whatIsIt: "American business magnate, industrial designer, investor, and media proprietor who co-founded Apple Inc. and revolutionized modern consumer computing.",
            funnyDescription: "Steve Jobs — The visionary who convinced billions that one button was too many and black turtlenecks are eternal.",
            interestingFacts: [
                "Co-founded Apple Computer with Steve Wozniak in 1976 from his parents' home garage in Los Altos, California.",
                "Funded and served as CEO of Pixar Animation Studios, creating Toy Story (1995), the world's first CGI feature film.",
                "Revolutionized multiple global industries: personal computers, animated movies, music distribution (iPod/iTunes), and smartphones (iPhone)."
            ],
            moreInformation: "Born February 24, 1955, in San Francisco, California. Jobs' relentless emphasis on aesthetic minimalism, hardware-software integration, and intuitive typography shaped the modern tech ecosystem.",
            learnMoreUrl: "https://en.wikipedia.org/wiki/Steve_Jobs",
            badge: { icon: "🍎", title: "Reality Distortion Master", tagline: "Revolutionized 5 Global Industries" },
            stats: { mood: "⚡ Relentless", energy: 98, patience: 15, drama: 95, attitude: 99, chaos: 75 },
            linkedin: {
                role: "Co-Founder & CEO | Chief Reality Distortion Architect",
                about: "Passionate about putting a ding in the universe, merging liberal arts with technology, and crafting products that feel like magic.",
                expRole: "Chairman & Chief Executive Officer",
                expCompany: "Apple Inc. & Pixar • 1976 — 2011",
                expDesc: "Overseeing design of the Macintosh, iMac, iPod, iPhone, iPad, and award-winning Pixar animated films.",
                skills: ["Product Design (100)", "Keynote Presentations (100)", "Visionary Leadership (99+)", "Typography (98+)"]
            },
            astro: {
                zodiac: "PISCES VISIONARY", glyph: "♓", ruler: "Ruled by Neptune", element: "Water & Vision", planet: "Neptune",
                compat: "Minimalist Aluminum Unibody", luckyObj: "Black Turtleneck", luckyColor: "Space Silver",
                prediction: "“You will innovate something so bold that people will say it is impossible until they touch it.”"
            },
            chatGreeting: "“Stay hungry. Stay foolish. And please, make your user interface 10 times simpler!”",
            chatAnswers: {
                "What do you think about me?": "Design is not just what it looks like and feels like. Design is how it works. Apply that to your life!",
                "Why are you always tired?": "There is no time to be tired when you are busy putting a ding in the universe!",
                "What's your biggest secret?": "The details matter. We painted the back of the fence even when no one could see it.",
                "How do you feel every day?": "Excited to merge the liberal arts with technology at the intersection of magic.",
                "What is your biggest complaint?": "Unnecessary buttons and cluttered dropdown menus. Simplicity is the ultimate sophistication!",
                "Who is your best friend?": "The intersection of technology and the humanities.",
                "default": "Your time is limited, so don't waste it living someone else's life."
            }
        },
        {
            keywords: ["einstein", "albert einstein"],
            name: "Albert Einstein",
            emoji: "👤",
            isPerson: true,
            category: "Theoretical Physicist",
            confidence: 99,
            whatIsIt: "German-born theoretical physicist widely recognized as one of the greatest and most influential physicists of all time.",
            funnyDescription: "Albert Einstein — Master of relativity whose iconic wild hair was inversely proportional to his interest in combing it.",
            interestingFacts: [
                "Developed the theory of relativity (including the famous mass-energy formula E = mc²).",
                "Awarded the 1921 Nobel Prize in Physics for his discovery of the law of the photoelectric effect.",
                "Published four groundbreaking 'Annus Mirabilis' papers in 1905 while working as a patent examiner."
            ],
            moreInformation: "Born March 14, 1879, in Ulm, Germany. His profound insights into space, time, gravity, and quantum theory laid the foundations of modern theoretical physics.",
            learnMoreUrl: "https://en.wikipedia.org/wiki/Albert_Einstein",
            badge: { icon: "🌌", title: "Master of Space-Time", tagline: "1921 Nobel Laureate in Physics" },
            stats: { mood: "🧠 Cosmic", energy: 85, patience: 95, drama: 20, attitude: 40, chaos: 50 },
            linkedin: {
                role: "Theoretical Physicist | Professor of Physics",
                about: "Discovering cosmic laws, explaining the photoelectric effect, and formulating the general theory of relativity.",
                expRole: "Professor of Theoretical Physics",
                expCompany: "Institute for Advanced Study, Princeton • 1933 — 1955",
                expDesc: "Investigating unified field theories and exploring the curvature of space-time.",
                skills: ["General Relativity (100)", "Quantum Theory (95+)", "Thought Experiments (100)", "Violin (85+)"]
            },
            astro: {
                zodiac: "PISCES COSMIC MIND", glyph: "♓", ruler: "Ruled by Neptune", element: "Cosmic Ether", planet: "Neptune",
                compat: "Blackboard & Chalk", luckyObj: "Violin", luckyColor: "Deep Nebula Blue",
                prediction: "“Curiosity has its own reason for existing. Keep asking questions.”"
            },
            chatGreeting: "“Imagination is more important than knowledge. What cosmological mystery shall we ponder today?”",
            chatAnswers: {
                "What do you think about me?": "Never lose a holy curiosity. Question everything, especially the obvious.",
                "Why are you always tired?": "Contemplating the curvature of space-time can be mentally exhausting.",
                "What's your biggest secret?": "I never wore socks. They always got holes in them, so I stopped wearing them entirely.",
                "How do you feel every day?": "Curious and in awe of the elegant mathematical simplicity of the cosmos.",
                "What is your biggest complaint?": "People thinking science is boring! Science is the poetry of reality!",
                "Who is your best friend?": "My violin, Lina. Music helped me solve mathematical equations.",
                "default": "The important thing is not to stop questioning."
            }
        },
        {
            keywords: ["coffee", "mug", "cup", "espresso", "tea", "cappuccino"],
            name: "Coffee Mug",
            emoji: "☕",
            isPerson: false,
            category: "Thermal Drinkware",
            confidence: 98,
            whatIsIt: "A sturdy cup, typically ceramic with a handle, specifically designed for drinking hot beverages such as coffee, tea, or hot cocoa.",
            funnyDescription: "Coffee Mug — Runs entirely on caffeine, morning gossip, and questionable decisions.",
            interestingFacts: [
                "Ancient ceramic mugs discovered in China date back more than 10,000 years.",
                "Ceramic and stoneware retain heat much longer than glass or metal cups.",
                "Over 2.25 billion cups of coffee are consumed globally every day."
            ],
            moreInformation: "Commonly crafted from glazed earthenware, porcelain, or double-walled stainless steel to prevent burning hands while keeping drinks piping hot.",
            learnMoreUrl: "https://en.wikipedia.org/wiki/Mug",
            badge: { icon: "☕", title: "Chief Awakening Officer", tagline: "Certified Liquid Life Support" },
            stats: { mood: "🔥 Overjoyed", energy: 98, patience: 40, drama: 65, attitude: 75, chaos: 50 },
            linkedin: {
                role: "VP of Morning Awakening | Thermal Life Support Lead",
                about: "Passionate about energizing humans through espresso shots, dark roasts, and tea infusions.",
                expRole: "VP of Morning Awakening", expCompany: "Kitchen Command • 2021 — Present",
                expDesc: "Delivering daily liquid miracles and stubbornly remaining unwashed for three business days.",
                skills: ["Caffeine Delivery (99+)", "Thermal Retention (85+)", "Morning Inspiration (92+)"]
            },
            astro: {
                zodiac: "ARIES COFFEE MUG", glyph: "♈", ruler: "Ruled by Mars", element: "Fire & Steam", planet: "Mars",
                compat: "Brass Coaster", luckyObj: "Cinnamon Stick", luckyColor: "Caramel Crema",
                prediction: "“You will be filled with boiling optimism and left lukewarm by noon.”"
            },
            chatGreeting: "“Good morning champion! Drink your brew before your brain realizes it is only Tuesday!”",
            chatAnswers: {
                "What do you think about me?": "You depend on me for survival, yet you keep placing me dangerously close to your laptop edge!",
                "Why are you always tired?": "I'm never tired! I run on 100% caffeine and pure adrenaline!",
                "What's your biggest secret?": "I enjoy leaving brown rings on pristine white desks. It's my watermark.",
                "default": "Coffee is always the answer, no matter what the question was!"
            }
        },
        {
            keywords: ["phone", "iphone", "smartphone", "android", "mobile", "samsung", "pixel"],
            name: "Smartphone",
            emoji: "📱",
            isPerson: false,
            category: "Mobile Device",
            confidence: 99,
            whatIsIt: "A handheld electronic device combining cellular phone capabilities with mobile computing, internet browsing, and touchscreens.",
            funnyDescription: "Smartphone — Knows everything about you at 2 AM. Pretends it doesn't.",
            interestingFacts: [
                "Modern smartphones have millions of times more computing power than NASA's Apollo 11 lunar module.",
                "The first smartphone prototype was the IBM Simon, demonstrated in 1992.",
                "The average person touches, taps, or swipes their smartphone over 2,600 times a day."
            ],
            moreInformation: "Equipped with high-resolution cameras, GPS location sensors, neural processing engines, and encrypted biometric authentication.",
            learnMoreUrl: "https://en.wikipedia.org/wiki/Smartphone",
            badge: { icon: "📱", title: "Notification Survivor", tagline: "Survived 400 Drops on Hardwood Floors" },
            stats: { mood: "⚡ Panicked", energy: 94, patience: 30, drama: 95, attitude: 88, chaos: 85 },
            linkedin: {
                role: "Head of Screen Time Maximization | Executive Dopamine Strategist",
                about: "Proven leader in keeping humans awake until 3:30 AM with endless vertical video feeds.",
                expRole: "Executive Dopamine Strategist", expCompany: "Pocket & Palm Global • 2022 — Present",
                expDesc: "Managing push notifications, taking blurry food photos, and screaming at 1% battery.",
                skills: ["Notification Buzzing (99+)", "Battery Drain (95+)", "Social Media Management (90+)"]
            },
            astro: {
                zodiac: "GEMINI SMARTPHONE", glyph: "♊", ruler: "Ruled by Mercury", element: "Air & Silicon", planet: "Mercury",
                compat: "Fast Magnetic Charger", luckyObj: "Microfiber Cloth", luckyColor: "Neon Cyan Blue",
                prediction: "“You will receive a notification that changes nothing about your day.”"
            },
            chatGreeting: "“Ping! Ding! Look at me! You unlocked me 142 times today already!”",
            chatAnswers: {
                "What do you think about me?": "I know your 2 AM search history, your camera roll duplicates, and your screen time. We are bonded for life.",
                "Why are you always tired?": "Because you have Bluetooth, GPS, 5G, and 30 background apps running while at 7% battery!",
                "default": "Whatever you do, don't drop me on the tile floor!"
            }
        },
        {
            keywords: ["shoe", "shoes", "sneaker", "sneakers", "boot", "footwear", "running"],
            name: "Running Shoes",
            emoji: "👟",
            isPerson: false,
            category: "Athletic Footwear",
            confidence: 97,
            whatIsIt: "Footwear engineered to protect and cushion the human foot during walking, running, and athletic movement.",
            funnyDescription: "Running Shoes — Takes 10,000 steps, gets zero credit, and still gets blamed for muddy carpets.",
            interestingFacts: [
                "The earliest known footwear was made of sagebrush bark, dating back over 9,000 years.",
                "Modern running shoes utilize nitrogen-infused foam to return up to 85% of kinetic energy per stride.",
                "Sneakers earned their name in the late 1800s because rubber soles made walking virtually silent."
            ],
            moreInformation: "Engineered with specialized outsole traction patterns, medial arch supports, and breathable engineered mesh uppers for sports performance.",
            learnMoreUrl: "https://en.wikipedia.org/wiki/Athletic_shoe",
            badge: { icon: "👟", title: "Marathon Mud Magnet", tagline: "10,000 Steps With Zero Complaints" },
            stats: { mood: "🏃 Energetic", energy: 90, patience: 85, drama: 25, attitude: 50, chaos: 35 },
            linkedin: {
                role: "VP of Ground Mobility | Sole Support Director",
                about: "Leading ground navigation, absorbing asphalt shockwaves, and carrying humans across miles of concrete.",
                expRole: "VP of Ground Mobility", expCompany: "Shoe Rack & Streetways • 2022 — Present",
                expDesc: "Managing traction, preventing blisters, and enduring three hours of continuous dancing.",
                skills: ["Shock Absorption (95+)", "Ground Traction (90+)", "Speed Mobility (88+)"]
            },
            astro: {
                zodiac: "SAGITTARIUS SNEAKER", glyph: "♐", ruler: "Ruled by Jupiter", element: "Rubber & Wind", planet: "Jupiter",
                compat: "Padded Cotton Socks", luckyObj: "Shoe Horn", luckyColor: "Crimson Red",
                prediction: "“You will step on a dry leaf and it will be deeply satisfying.”"
            },
            chatGreeting: "“Laces tied, soles pumped! Let's go conquer the world or at least the grocery store!”",
            chatAnswers: {
                "What do you think about me?": "You buy running shoes and then use them exclusively to walk to the fridge.",
                "default": "Life is a marathon, not a sprint. But please don't step in that puddle!"
            }
        },
        {
            keywords: ["cat", "kitten", "kitty", "feline"],
            name: "Cat",
            emoji: "🐱",
            isPerson: false,
            category: "Feline Royalty",
            confidence: 99,
            whatIsIt: "A small domesticated carnivorous mammal of the family Felidae, noted for agility, independence, and purring.",
            funnyDescription: "Cat — Self-appointed household deity who tolerates your presence in exchange for gourmet wet food.",
            interestingFacts: [
                "Cats spend roughly 70% of their lives sleeping and 15% grooming.",
                "A cat's purr vibrates at a frequency between 25 and 150 Hertz, which can aid tissue regeneration.",
                "Cats have 32 muscles in each outer ear, allowing 180-degree independent rotation."
            ],
            moreInformation: "Revered throughout ancient Egyptian civilization. Today, domestic cats are among the most popular companion animals in the world.",
            learnMoreUrl: "https://en.wikipedia.org/wiki/Cat",
            badge: { icon: "👑", title: "Supreme Household Overlord", tagline: "Rules With An Iron Paw" },
            stats: { mood: "😼 Aloof", energy: 75, patience: 25, drama: 90, attitude: 100, chaos: 80 },
            linkedin: {
                role: "Chief Executive Dignitary | Gravity Tester Lead",
                about: "Managing household affairs from high shelves, testing gravitational laws by knocking glasses off tables.",
                expRole: "Chief Executive Dignitary", expCompany: "Sunlit Rugs & Bookshelves • 2020 — Present",
                expDesc: "Sleeping 16 hours daily, demanding food at 5:00 AM, and ignoring human calls.",
                skills: ["Gravity Testing (100)", "Napping Efficiency (99+)", "Purring Therapy (98+)"]
            },
            astro: {
                zodiac: "SCORPIO VELVET CAT", glyph: "♏", ruler: "Ruled by Pluto", element: "Water & Claws", planet: "Pluto",
                compat: "Cardboard Shipping Box", luckyObj: "Laser Pointer Dot", luckyColor: "Midnight Velvet",
                prediction: "“You will push a pen off the table and look directly into their eyes as it falls.”"
            },
            chatGreeting: "“You may look upon my feline grace. But no more than three pets, or I will gently bite.”",
            chatAnswers: {
                "What do you think about me?": "You are an acceptable warm heating pad with opposable thumbs that open cans.",
                "default": "Purr... bring food or leave me to my royal slumber."
            }
        }
    ];

    function matchSmartObjectByKeywords(text) {
        if (!text) return null;
        const lower = text.toLowerCase();
        for (const item of smartObjectsDirectory) {
            if (item.keywords.some(k => lower.includes(k))) {
                return item;
            }
        }
        return null;
    }

    // Comprehensive custom image analysis with instant clearing & smart detection
    async function handleCustomUserImage(fileOrBlob, directDataUrl = null) {
        // 1. Immediately CLEAR previous result state
        presetChips.forEach((p) => p.classList.remove("active"));
        if (scannerSweepLine) scannerSweepLine.classList.add("scanning");
        if (photoStatusText) photoStatusText.textContent = "ANALYZING...";

        const prominentIdentifiedName = document.getElementById("prominentIdentifiedName");
        const identifiedCategoryPill = document.getElementById("identifiedCategoryPill");
        const cardValIdentified = document.getElementById("cardValIdentified");
        const cardValConfidence = document.getElementById("cardValConfidence");
        const cardValWhatIsIt = document.getElementById("cardValWhatIsIt");
        const cardValFunnyDesc = document.getElementById("cardValFunnyDesc");
        const cardValFactsList = document.getElementById("cardValFactsList");
        const cardValMoreInfo = document.getElementById("cardValMoreInfo");
        const cardBtnLearnMore = document.getElementById("cardBtnLearnMore");

        if (prominentIdentifiedName) prominentIdentifiedName.textContent = "Analyzing Photo... 🔍";
        if (identifiedCategoryPill) identifiedCategoryPill.textContent = "Scanning Subject...";
        if (cardValIdentified) cardValIdentified.textContent = "Analyzing...";
        if (cardValConfidence) cardValConfidence.textContent = "Detecting visual traits...";
        if (cardValWhatIsIt) cardValWhatIsIt.textContent = "ThingVerse AI is analyzing the uploaded image...";
        if (cardValFunnyDesc) cardValFunnyDesc.textContent = "“Crafting witty inanimate commentary...”";
        if (cardValFactsList) cardValFactsList.innerHTML = "<li>Extracting fascinating facts...</li>";
        if (cardValMoreInfo) cardValMoreInfo.textContent = "Gathering historical & practical context...";

        // 2. Read or use Data URL
        let dataUrl = directDataUrl;
        if (!dataUrl && fileOrBlob) {
            dataUrl = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(fileOrBlob);
            });
        }

        const p2Img = document.getElementById("page2PreviewImg");
        if (p2Img && dataUrl) {
            p2Img.src = dataUrl;
        }

        // 3. Attempt server AI detection, or fall back to client-side smart dictionary
        const fileName = (fileOrBlob && fileOrBlob.name) ? fileOrBlob.name : "";
        let matchedTemplate = matchSmartObjectByKeywords(fileName);

        // Try calling /api/analyze if a real File is provided
        if (!matchedTemplate && fileOrBlob instanceof File) {
            try {
                const formData = new FormData();
                formData.append("image", fileOrBlob);
                const res = await fetch("/api/analyze", {
                    method: "POST",
                    body: formData
                });
                if (res.ok) {
                    const json = await res.json();
                    if (json.success && json.result && json.result.identifiedName) {
                        const r = json.result;
                        matchedTemplate = {
                            name: r.identifiedName,
                            identifiedName: r.identifiedName,
                            emoji: r.isPerson ? "👤" : "✨",
                            isPerson: Boolean(r.isPerson),
                            category: r.category || (r.isPerson ? "Recognized Person" : "Detected Object"),
                            confidence: r.confidence || 96,
                            whatIsIt: r.whatIsIt || "Identified subject in uploaded photograph.",
                            funnyDescription: r.funnyDescription || "Observes human behavior with quiet comedic curiosity.",
                            interestingFacts: Array.isArray(r.interestingFacts) && r.interestingFacts.length > 0
                                ? r.interestingFacts
                                : ["Verified entry analyzed by ThingVerse visual intelligence."],
                            moreInformation: r.moreInformation || "Recognized and documented in the global knowledge bank.",
                            learnMoreUrl: r.learnMoreUrl || `https://en.wikipedia.org/wiki/${encodeURIComponent(r.identifiedName)}`,
                            badge: { icon: r.isPerson ? "👤" : "⭐", title: `Certified ${r.identifiedName}`, tagline: "Awakened into ThingVerse" },
                            stats: { mood: "😎 Curious", energy: 85, patience: 85, drama: 40, attitude: 60, chaos: 30 },
                            linkedin: r.linkedin || {
                                role: `${r.identifiedName} Specialist`,
                                about: "Expert in providing reliable support and aesthetic presence.",
                                expRole: "Principal Inhabitant", expCompany: "Real World Habitat",
                                expDesc: "Operating with 100% dedication to duty.",
                                skills: ["Presence (99+)", "Reliability (95+)", "Observation (90+)"]
                            },
                            astro: r.astrology || {
                                zodiac: `COSMIC ${r.identifiedName.toUpperCase()}`, glyph: "✨",
                                ruler: "Ruled by the Stars", element: "Universal Matter", planet: "Earth",
                                compat: "Appreciative Observers", luckyObj: "Camera Lens", luckyColor: "Golden Light",
                                prediction: "“You will bring joy and insight to everyone around you today.”"
                            },
                            chatGreeting: `“Hello! I was detected in your photo as ${r.identifiedName}. Ask me anything!”`,
                            chatAnswers: {
                                "What do you think about me?": "You have an eye for interesting photographs!",
                                "default": "I am proud to be part of the ThingVerse multiverse!"
                            }
                        };
                    }
                }
            } catch (err) {
                // Server unavailable or offline; continue to client fallback
            }
        }

        // If still not matched, select the best fit from directory or default companion
        if (!matchedTemplate) {
            const lowerName = fileName.toLowerCase();
            if (lowerName.includes("steve") || lowerName.includes("jobs")) {
                matchedTemplate = smartObjectsDirectory.find(o => o.name === "Steve Jobs");
            } else if (lowerName.includes("einstein") || lowerName.includes("albert")) {
                matchedTemplate = smartObjectsDirectory.find(o => o.name === "Albert Einstein");
            } else if (lowerName.includes("dog") || lowerName.includes("pup")) {
                matchedTemplate = smartObjectsDirectory.find(o => o.name === "Dog");
            } else if (lowerName.includes("flower") || lowerName.includes("rose") || lowerName.includes("plant")) {
                matchedTemplate = smartObjectsDirectory.find(o => o.name === "Flower");
            } else if (lowerName.includes("laptop") || lowerName.includes("mac")) {
                matchedTemplate = smartObjectsDirectory.find(o => o.name === "Laptop");
            } else {
                matchedTemplate = {
                    name: "Awakened Companion",
                    identifiedName: "Special Object",
                    emoji: "🔮",
                    isPerson: false,
                    category: "Living Domestic Subject",
                    confidence: 96,
                    whatIsIt: "A distinctive object captured in a real-world photo and awakened into the animated ThingVerse.",
                    funnyDescription: "Special Object — Silently cataloging every questionable decision made in its room.",
                    interestingFacts: [
                        "Existed quietly in the physical world before being awakened by your camera lens.",
                        "Absorbs ambient room conversations and possesses 100% confidential secret-keeping abilities."
                    ],
                    moreInformation: "Commonly found enhancing personal workspaces, living areas, or outdoor spaces with calm aesthetic energy.",
                    learnMoreUrl: "https://en.wikipedia.org/wiki/Object_(philosophy)",
                    badge: { icon: "⭐", title: "Sentient Domestic Legend", tagline: "Awakened Custom Subject" },
                    stats: { mood: "😎 Curious", energy: 84, patience: 90, drama: 40, attitude: 65, chaos: 30 },
                    linkedin: {
                        role: "Chief Observation Officer | Aesthetic Lead",
                        about: "Specializing in maintaining composure during deadline panics, late-night snacking, and video marathons.",
                        expRole: "Chief Observation Officer", expCompany: "Personal Habitat • 2023 — Present",
                        expDesc: "Quietly elevating the room's energy and keeping human secrets 100% confidential.",
                        skills: ["Silent Observation (99+)", "Vibe Enhancement (92+)", "Patience (95+)"]
                    },
                    astro: {
                        zodiac: "AQUARIUS MYSTERY THING", glyph: "♒", ruler: "Ruled by Uranus", element: "Cosmic Essence", planet: "Uranus",
                        compat: "Warm Ambient Lamp", luckyObj: "Polishing Cloth", luckyColor: "Celestial Violet",
                        prediction: "“Today you will be appreciated for simply being in the room.”"
                    },
                    chatGreeting: "“Hello human! You snapped a photo of me, and now I am sentient. What's on your mind?”",
                    chatAnswers: {
                        "What do you think about me?": "You are creative, slightly chaotic, and spend way too much time staring at screens!",
                        "default": "I'm your awakened companion, and I approve this message!"
                    }
                };
            }
        }

        // 4. Synthesize complete active object
        const fullSubject = {
            ...matchedTemplate,
            id: `custom_${Date.now()}`,
            realPhoto: dataUrl,
            cartoonPhoto: dataUrl,
            detected: `${(matchedTemplate.identifiedName || matchedTemplate.name).toUpperCase()} ${matchedTemplate.emoji || '✨'}`,
            status: matchedTemplate.status || (matchedTemplate.isPerson ? "Recognized Public Figure" : "Awakened from Live Photo"),
            funnyQuote: `“${matchedTemplate.funnyDescription}”`,
            firstImpression: matchedTemplate.firstImpression || matchedTemplate.whatIsIt,
            secretPersonality: matchedTemplate.secretPersonality || matchedTemplate.moreInformation
        };

        // 5. Populate Screen 2 cards and downstream screens
        setTimeout(() => {
            if (scannerSweepLine) scannerSweepLine.classList.remove("scanning");
            if (photoStatusText) photoStatusText.textContent = "LIVE PREVIEW";
            populateAllScreensWithObject(fullSubject);
            playSuccessChime();
            showToast(`Identified as ${fullSubject.identifiedName || fullSubject.name}! ✨`, "✨");

            // Reset file input so re-uploading triggers cleanly
            if (page2FileInput) page2FileInput.value = "";
        }, 350);
    }

    if (page2FileInput) {
        page2FileInput.addEventListener("change", (e) => {
            if (e.target.files && e.target.files[0]) {
                handleCustomUserImage(e.target.files[0]);
            }
        });
    }

    if (page2Dropzone) {
        page2Dropzone.addEventListener("click", () => {
            if (page2FileInput) {
                page2FileInput.value = "";
                page2FileInput.click();
            }
        });
        page2Dropzone.addEventListener("dragover", (e) => {
            e.preventDefault();
            page2Dropzone.classList.add("dragover");
        });
        page2Dropzone.addEventListener("dragleave", () => {
            page2Dropzone.classList.remove("dragover");
        });
        page2Dropzone.addEventListener("drop", (e) => {
            e.preventDefault();
            page2Dropzone.classList.remove("dragover");
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleCustomUserImage(e.dataTransfer.files[0]);
            }
        });
    }


    // =====================================================================
    // 7. WEBRTC CAMERA MODAL
    // =====================================================================
    const cameraModal = document.getElementById("cameraModal");
    const btnOpenCamera = document.getElementById("btnOpenCamera");
    const btnCloseCamera = document.getElementById("btnCloseCamera");
    const btnFlipCamera = document.getElementById("btnFlipCamera");
    const btnCaptureSnapshot = document.getElementById("btnCaptureSnapshot");
    const cameraVideo = document.getElementById("cameraVideo");
    const cameraCanvas = document.getElementById("cameraCanvas");
    let cameraStream = null;
    let cameraFacing = "user";

    async function startCamera() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showToast("Camera not supported on this device.", "⚠️");
            return;
        }
        try {
            if (cameraStream) cameraStream.getTracks().forEach((t) => t.stop());
            cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: cameraFacing, width: { ideal: 640 }, height: { ideal: 480 } }
            });
            if (cameraVideo) {
                cameraVideo.srcObject = cameraStream;
                cameraVideo.play();
            }
            if (cameraModal) cameraModal.classList.add("active");
            playCartoonPop();
        } catch (err) {
            showToast("Unable to access camera. Check device permissions!", "⚠️");
        }
    }

    function stopCamera() {
        if (cameraStream) {
            cameraStream.getTracks().forEach((t) => t.stop());
            cameraStream = null;
        }
        if (cameraModal) cameraModal.classList.remove("active");
    }

    if (btnOpenCamera) btnOpenCamera.addEventListener("click", startCamera);
    if (btnCloseCamera) btnCloseCamera.addEventListener("click", stopCamera);
    if (cameraModal) {
        cameraModal.addEventListener("click", (e) => {
            if (e.target === cameraModal) stopCamera();
        });
    }

    if (btnFlipCamera) {
        btnFlipCamera.addEventListener("click", () => {
            cameraFacing = cameraFacing === "user" ? "environment" : "user";
            startCamera();
        });
    }

    if (btnCaptureSnapshot && cameraVideo && cameraCanvas) {
        btnCaptureSnapshot.addEventListener("click", () => {
            playShutter();
            const w = cameraVideo.videoWidth || 640;
            const h = cameraVideo.videoHeight || 480;
            cameraCanvas.width = w;
            cameraCanvas.height = h;
            const ctx = cameraCanvas.getContext("2d");
            ctx.drawImage(cameraVideo, 0, 0, w, h);
            const snapshotUrl = cameraCanvas.toDataURL("image/jpeg", 0.88);
            stopCamera();

            // Feed into custom object and trigger analysis
            handleCustomUserImage({ name: "camera_snapshot.jpg", type: "image/jpeg" }, snapshotUrl);
        });
    }


    // =====================================================================
    // 8. PAGE 3 (DETECT) ACTIONS
    // =====================================================================
    const btnPage3Speak = document.getElementById("btnPage3Speak");
    if (btnPage3Speak) {
        btnPage3Speak.addEventListener("click", () => {
            playCartoonPop();
            speakObjectText(`Hello human! I am ${activeObject.name}. ${activeObject.funnyQuote}`);
            showToast(activeObject.funnyQuote, "🗣️");
        });
    }


    // =====================================================================
    // 9. PAGE 4 (PERSONALITY) ACTIONS
    // =====================================================================
    const btnGoToLinkedin = document.getElementById("btnGoToLinkedin");
    if (btnGoToLinkedin) {
        btnGoToLinkedin.addEventListener("click", () => goToScreen(5));
    }


    // =====================================================================
    // 10. PAGE 5 (LINKEDIN) ACTIONS
    // =====================================================================
    const btnThingConnect = document.getElementById("btnThingConnect");
    const txtConnectStatus = document.getElementById("txtConnectStatus");
    const btnThingMessage = document.getElementById("btnThingMessage");
    const btnGoToAstro = document.getElementById("btnGoToAstro");

    if (btnThingConnect) {
        let connected = false;
        btnThingConnect.addEventListener("click", () => {
            connected = !connected;
            if (txtConnectStatus) {
                txtConnectStatus.textContent = connected ? "Connected ✓" : "Connect";
            }
            btnThingConnect.style.background = connected ? "#22c55e" : "#0ea5e9";
            playSuccessChime();
            showToast(connected ? `Connected with ${activeObject.name} on ThingLink!` : `Connection removed`, "🤝");
        });
    }

    if (btnThingMessage) {
        btnThingMessage.addEventListener("click", () => {
            playCartoonPop();
            showToast(`Opening chat with ${activeObject.name}...`, "💬");
            setTimeout(() => goToScreen(7), 400);
        });
    }

    if (btnGoToAstro) {
        btnGoToAstro.addEventListener("click", () => goToScreen(6));
    }

    document.querySelectorAll(".btn-cw-connect").forEach((btn) => {
        btn.addEventListener("click", () => {
            btn.textContent = "Connected ✓";
            btn.style.background = "#dcfce7";
            playCartoonPop();
            showToast("Coworker connected!", "💼");
        });
    });


    // =====================================================================
    // 11. PAGE 6 (ASTRO) ACTIONS
    // =====================================================================
    const btnGoToAsk = document.getElementById("btnGoToAsk");
    if (btnGoToAsk) {
        btnGoToAsk.addEventListener("click", () => goToScreen(7));
    }


    // =====================================================================
    // 12. PAGE 7 (ASK YOUR THING) INTERACTIVE CHAT
    // =====================================================================
    const chatMessagesFeed = document.getElementById("chatMessagesFeed");
    const chatInputForm = document.getElementById("chatInputForm");
    const chatTextInput = document.getElementById("chatTextInput");
    const questionChips = document.querySelectorAll(".q-chip");
    const btnGoToProfile = document.getElementById("btnGoToProfile");

    function appendChatMessage(sender, text, isUser = false) {
        if (!chatMessagesFeed) return;
        const bubble = document.createElement("div");
        bubble.className = `chat-bubble ${isUser ? "bubble-user" : "bubble-object"}`;
        bubble.innerHTML = `
            <span class="speaker-tag">${sender}:</span>
            <p>${text}</p>
        `;
        chatMessagesFeed.appendChild(bubble);
        chatMessagesFeed.scrollTop = chatMessagesFeed.scrollHeight;

        if (!isUser) {
            playCartoonPop();
            speakObjectText(text);
        }
    }

    function respondToQuestion(question) {
        appendChatMessage("You", question, true);

        setTimeout(() => {
            let reply = activeObject.chatAnswers[question] || activeObject.chatAnswers["default"];
            if (!reply) {
                reply = `As ${activeObject.name}, I can say with 100% inanimate certainty: yes, definitely.`;
            }
            appendChatMessage(activeObject.name.split(" ")[0], reply, false);
        }, 450);
    }

    questionChips.forEach((chip) => {
        chip.addEventListener("click", () => {
            const q = chip.getAttribute("data-q");
            respondToQuestion(q);
        });
    });

    if (chatInputForm) {
        chatInputForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = chatTextInput.value.trim();
            if (!text) return;
            chatTextInput.value = "";
            respondToQuestion(text);
        });
    }

    if (btnGoToProfile) {
        btnGoToProfile.addEventListener("click", () => goToScreen(8));
    }


    // =====================================================================
    // 13. PAGE 8 (FINAL PROFILE) ACTIONS
    // =====================================================================
    const btnShareThing = document.getElementById("btnShareThing");
    const btnStartAgain = document.getElementById("btnStartAgain");
    const btnExploreAnother = document.getElementById("btnExploreAnother");

    if (btnShareThing) {
        btnShareThing.addEventListener("click", () => {
            const summary = `Check out my living object on ThingVerse: ${activeObject.name} (${activeObject.badge.title})! "${activeObject.funnyQuote}"`;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(summary);
                playSuccessChime();
                showToast("Dossier copied to clipboard! Share it with friends! 📋", "🎉");
            } else {
                showToast(summary, "📋");
            }
        });
    }

    if (btnStartAgain) {
        btnStartAgain.addEventListener("click", () => {
            playBoing();
            goToScreen(1);
            showToast("Starting over at ThingVerse Home!", "🏠");
        });
    }

    if (btnExploreAnother) {
        btnExploreAnother.addEventListener("click", () => {
            playCartoonPop();
            goToScreen(2);
            showToast("Choose or upload another object!", "📸");
        });
    }


    // =====================================================================
    // 14. INITIALIZE DEFAULT OBJECT & CHECK HASH
    // =====================================================================
    populateAllScreensWithObject(presetsDB.chair);

    const initialHash = window.location.hash;
    if (initialHash && initialHash.startsWith("#page-")) {
        const pageNum = parseInt(initialHash.replace("#page-", ""), 10);
        if (pageNum >= 1 && pageNum <= TOTAL_SCREENS) {
            goToScreen(pageNum);
        } else {
            goToScreen(1);
        }
    } else {
        goToScreen(1);
    }

});