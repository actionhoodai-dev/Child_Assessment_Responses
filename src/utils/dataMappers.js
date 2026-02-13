
/**
 * Maps a flat record (e.g., from Google Sheets) to the nested assessment state structure.
 * This allows the PDF generator to work with historical data.
 */
export const mapRecordToAssessmentState = (record) => {
    if (!record) return null;

    // Create a normalized map of the record keys for fuzzy matching
    // Key: stripped lowercase key (no _, no spaces), Value: original key
    const normalizedKeys = {};
    Object.keys(record).forEach(key => {
        const stripped = key.toLowerCase().replace(/[\s_]/g, '');
        normalizedKeys[stripped] = key;
    });

    // Helper to find value using fuzzy matching
    const fuzzyFind = (searchTerms) => {
        for (const term of searchTerms) {
            // 1. Direct lookup
            if (record[term] !== undefined && record[term] !== "") return record[term];

            // 2. Check localized/stripped keys
            const strippedTerm = term.toLowerCase().replace(/[\s_]/g, '');
            if (normalizedKeys[strippedTerm]) {
                const val = record[normalizedKeys[strippedTerm]];
                if (val !== undefined && val !== "") return val;
            }
        }
        return "";
    };

    // Helper to specific skill value
    const findSkillValue = (category, skill, suffix = "") => {
        // Construct potential search terms
        // We look for:
        // 1. category_skill_suffix
        // 2. skill_suffix (if unique)
        // 3. category_skill (if suffix is value or empty)

        const catStart = category.toLowerCase();
        const skillName = skill.toLowerCase();
        const sfx = suffix.toLowerCase();

        const searchTerms = [];

        if (sfx === "value" || sfx === "") {
            // Priority 1: Full path with value
            searchTerms.push(`${catStart}_${skillName}_value`);
            searchTerms.push(`${category}${skill}Value`); // camelCase variation

            // Priority 2: Full path without value
            searchTerms.push(`${catStart}_${skillName}`);
            searchTerms.push(`${category}${skill}`);

            // Priority 3: Just skill name (dangerous but valid fallback)
            searchTerms.push(skillName);
        } else {
            // For comments, etc.
            searchTerms.push(`${catStart}_${skillName}_${sfx}`);
            searchTerms.push(`${category}${skill}${suffix}`);
        }

        return fuzzyFind(searchTerms);
    };

    // Initialize with basic info
    // We try multiple variations for date
    const dateVal = fuzzyFind([
        "assessmentDate", "Date_of_Assess", "Assessment Date", "Date", "Timestamp", "Submission Date"
    ]);

    // Ensure valid date string if it's a timestamp or ISO string
    let formattedDate = dateVal;
    if (dateVal && !dateVal.includes("-") && !dateVal.includes("/")) {
        // Try to parse if it looks like a raw date object or irregular string
        try {
            const d = new Date(dateVal);
            if (!isNaN(d.getTime())) {
                formattedDate = d.toISOString().split('T')[0];
            }
        } catch (e) {
            // keep original if parse fails
        }
    }

    const state = {
        patientId: fuzzyFind(["patientId", "Patient_ID", "Patient ID", "ID"]),
        childName: fuzzyFind(["childName", "Child_Name", "Child Name", "Name", "Student Name"]),
        dob: fuzzyFind(["dob", "DOB", "Date of Birth", "Birth Date"]),
        age: fuzzyFind(["age", "Age"]),
        gender: fuzzyFind(["gender", "Gender", "Sex"]),
        assessmentDate: formattedDate,
        assessorName: fuzzyFind(["assessorName", "Assessor_Name", "Assessor", "Clinician"]),
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
                value: findSkillValue(category, skill, "value") || findSkillValue(category, skill, "") || "",
                comment: findSkillValue(category, skill, "comment") || ""
            };
        });
    });

    return state;
};
