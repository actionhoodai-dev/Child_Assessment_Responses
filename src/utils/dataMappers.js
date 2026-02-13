
/**
 * Maps a flat record (e.g., from Google Sheets) to the nested assessment state structure.
 * This allows the PDF generator to work with historical data.
 */
export const mapRecordToAssessmentState = (record) => {
    if (!record) return null;

    // Helper to find a value in the record using multiple potential key variations
    const findValue = (category, skill, suffix = "") => {
        // Prepare potential keys
        const keys = [
            // Standard: category_skill_suffix
            `${category}_${skill}${suffix ? '_' + suffix : ''}`,
            // Title Case: Category_Skill_Suffix
            `${category.charAt(0).toUpperCase() + category.slice(1)}_${skill}${suffix ? '_' + suffix : ''}`,
            // Spaced: Category Skill Suffix
            `${category} ${skill} ${suffix}`.trim(),
            // Direct skill name (fallback if unique)
            `${skill}${suffix ? '_' + suffix : ''}`
        ];

        for (const k of keys) {
            // Check exact match
            if (record[k] !== undefined) return record[k];
            // Check lowercase match
            const lowerK = k.toLowerCase();
            const foundKey = Object.keys(record).find(rk => rk.toLowerCase() === lowerK);
            if (foundKey) return record[foundKey];
        }

        // Specific fallback for "value" (often stored as just the skill name key)
        if (suffix === "value" || suffix === "") {
            // Try looking for just the skill name or Category_Skill
            const shortKeys = [
                `${category}_${skill}`,
                `${category.charAt(0).toUpperCase() + category.slice(1)}_${skill}`,
                skill
            ];
            for (const k of shortKeys) {
                const foundKey = Object.keys(record).find(rk => rk.toLowerCase() === k.toLowerCase());
                if (foundKey) return record[foundKey];
            }
        }

        return "";
    };

    // Initialize with basic info
    const state = {
        patientId: record.patientId || record["Patient_ID"] || record["Patient ID"] || "",
        childName: record.childName || record["Child_Name"] || record["Child Name"] || "",
        dob: record.dob || record["DOB"] || "",
        age: record.age || record["Age"] || "",
        gender: record.gender || record["Gender"] || "",
        assessmentDate: record.assessmentDate || record["Date_of_Assess"] || record["Assessment Date"] || "",
        assessorName: record.assessorName || record["Assessor_Name"] || record["Assessor Name"] || "",
    };

    // Structure of skills to map
    const structure = {
        gross: [
            "walksIndependently", "runsSteadily", "jumpsForward", "hopsOneFoot", "climbsStairs",
            "walksBackward", "throwsBall", "catchesBall", "kicksBall", "balancesOneFoot"
        ],
        fine: [
            "holdsPencil", "drawsShapes", "cutsScissors", "completesPuzzles", "stringsBeads",
            "buildsTower", "opensContainers", "turnsPages", "manipulatesObjects", "foldsPaper"
        ],
        language: [
            "identifiesObjects", "namesColors", "namesBodyParts", "answersWh", "followsTwoStep",
            "speaksSentences", "tellsStories", "usesPlurals", "understandsOpposites", "singsRhymes"
        ],
        communication: [
            "initiatesConversation", "maintainsEyeContact", "takesTurns", "asksForHelp", "respondsGreetings",
            "expressesNeeds", "usesFacialExpressions", "usesGestures", "appropriateTone", "pretendPlaySpeech"
        ],
        social: [
            "greetsPeers", "parallelPlay", "sharesMaterials", "takesTurnsGroup", "followsRules",
            "waitsPatiently", "expressesFeelings", "showsEmpathy", "resolvesConflicts", "joinsGroup"
        ],
        adl: [
            "toileting", "washesHands", "brushesTeeth", "eatsIndependently", "dresses",
            "wearsShoes", "zipsBag", "opensLunchbox", "packsBag", "recognizesBelongings"
        ],
        cognitive: [
            "identifiesNumbers", "countsObjects", "matchesShapes", "recognizesPatterns", "sameVsDifferent",
            "sortsObjects", "recallsItems", "completesTasks", "timeConcepts", "taskAttention"
        ]
    };

    // Reconstruct nested skills
    Object.entries(structure).forEach(([category, skills]) => {
        state[category] = {};
        skills.forEach(skill => {
            state[category][skill] = {
                value: findValue(category, skill, "value") || findValue(category, skill, "") || "",
                comment: findValue(category, skill, "comment") || ""
            };
        });
    });

    return state;
};
