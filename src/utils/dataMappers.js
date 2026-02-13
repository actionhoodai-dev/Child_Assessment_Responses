
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

    // Category aliases for broader matching
    const categoryAliases = {
        gross: ["gross", "grossmotor", "gross_motor", "gm"],
        fine: ["fine", "finemotor", "fine_motor", "fm"],
        language: ["language", "lang", "communication_language"],
        communication: ["communication", "comm", "communication_skills"],
        social: ["social", "social_interaction", "socialinteraction", "interaction"],
        adl: ["adl", "activities_of_daily_living", "daily_living", "activitiesofdailyliving"],
        cognitive: ["cognitive", "cog", "cognitive_skills"]
    };

    // Helper to specific skill value
    const findSkillValue = (category, skill, suffix = "") => {
        const skillName = skill.toLowerCase();
        // Break camelCase skill name for spaced variations (e.g., buildsTower -> builds tower)
        const unCameledSkill = skill.replace(/([A-Z])/g, ' $1').trim().toLowerCase();

        const sfx = suffix.toLowerCase();
        const searchTerms = [];

        // Get all aliases for the category
        const catPrefixes = categoryAliases[category] || [category];

        catPrefixes.forEach(cat => {
            const catStart = cat.toLowerCase();

            if (sfx === "value" || sfx === "") {
                // Category + Skill variations
                searchTerms.push(`${catStart}_${skillName}_value`);
                searchTerms.push(`${catStart}${skillName}value`);

                searchTerms.push(`${catStart}_${skillName}`);
                searchTerms.push(`${catStart}${skillName}`);

                // Category + Spaced Skill variations (e.g. fine motor builds tower)
                searchTerms.push(`${catStart}_${unCameledSkill}`);
                searchTerms.push(`${catStart} ${unCameledSkill}`);
            } else {
                searchTerms.push(`${catStart}_${skillName}_${sfx}`);
                searchTerms.push(`${catStart}${skillName}${sfx}`);
            }
        });

        // Global fallbacks (no category prefix)
        if (sfx === "value" || sfx === "") {
            searchTerms.push(skillName);
            searchTerms.push(unCameledSkill);

            // Try matching "Skill Name value"
            searchTerms.push(`${skillName}value`);
            searchTerms.push(`${unCameledSkill} value`);
        } else {
            searchTerms.push(`${skillName}_${sfx}`);
            searchTerms.push(`${skillName}${sfx}`);
        }

        const found = fuzzyFind(searchTerms);
        if (!found && (sfx === "value" || sfx === "")) {
            // console.warn(`Could not find value for ${category}.${skill}. Tried:`, searchTerms);
        }
        return found;
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
