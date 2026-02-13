
/**
 * Maps a flat record (e.g., from Google Sheets) to the nested assessment state structure.
 * This allows the PDF generator to work with historical data.
 */
export const mapRecordToAssessmentState = (record) => {
    if (!record) return null;

    // Create a normalized map of the record keys for fuzzy matching
    // Key: stripped lowercase alphanumeric key, Value: original key
    const normalizedKeys = {};
    Object.keys(record).forEach(key => {
        // Aggressively remove all non-alphanumeric characters
        const stripped = key.toLowerCase().replace(/[^a-z0-9]/g, '');
        normalizedKeys[stripped] = key;
    });

    // Helper to find value using fuzzy matching
    const fuzzyFind = (searchTerms) => {
        for (const term of searchTerms) {
            // 1. Direct lookup
            if (record[term] !== undefined && record[term] !== "") {
                return normalizeValue(record[term]);
            }

            // 2. Check localized/stripped alphanumeric keys
            const strippedTerm = term.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (normalizedKeys[strippedTerm]) {
                const val = record[normalizedKeys[strippedTerm]];
                if (val !== undefined && val !== "") return normalizeValue(val);
            }
        }
        return "";
    };

    // Normalize values like true/false/1/0 to Yes/No
    const normalizeValue = (val) => {
        if (typeof val === 'boolean') return val ? "Yes" : "No";
        if (val === 1 || val === "1") return "Yes";
        if (val === 0 || val === "0") return "No";
        if (typeof val === 'string') {
            const lowVal = val.trim().toLowerCase();
            if (lowVal === 'true') return "Yes";
            if (lowVal === 'false') return "No";
        }
        return val;
    };

    // Category aliases for broader matching
    const categoryAliases = {
        gross: ["gross", "grossmotor", "gross_motor", "gm", "gross_motor_skills"],
        fine: ["fine", "finemotor", "fine_motor", "fm", "fine_motor_skills"],
        language: ["language", "lang", "communication_language", "language_skills"],
        communication: ["communication", "comm", "communication_skills"],
        social: ["social", "social_interaction", "socialinteraction", "interaction", "social_skills"],
        adl: ["adl", "activities_of_daily_living", "daily_living", "activitiesofdailyliving", "adl_skills", "self_care"],
        cognitive: ["cognitive", "cog", "cognitive_skills", "cognitive_skill"]
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
                searchTerms.push(`${catStart}${unCameledSkill}`); // stripped space

                // Add common suffixes found in Form exports
                searchTerms.push(`${catStart}${skillName}response`);
                searchTerms.push(`${catStart}${unCameledSkill}response`);
                searchTerms.push(`${catStart}${skillName}yesno`);
                searchTerms.push(`${catStart}${unCameledSkill}yesno`);
            } else {
                searchTerms.push(`${catStart}_${skillName}_${sfx}`);
                searchTerms.push(`${catStart}${skillName}${sfx}`);
                searchTerms.push(`${catStart}_${unCameledSkill}_${sfx}`);
                searchTerms.push(`${catStart} ${unCameledSkill} ${sfx}`);
            }
        });

        // Global fallbacks (no category prefix)
        if (sfx === "value" || sfx === "") {
            searchTerms.push(skillName);
            searchTerms.push(unCameledSkill);

            // Try matching "Skill Name value"
            searchTerms.push(`${skillName}value`);
            searchTerms.push(`${unCameledSkill} value`);
            searchTerms.push(`${unCameledSkill}value`);
            searchTerms.push(`${skillName}response`);
            searchTerms.push(`${unCameledSkill}response`);
        } else {
            searchTerms.push(`${skillName}_${sfx}`);
            searchTerms.push(`${skillName}${sfx}`);
            searchTerms.push(`${unCameledSkill}_${sfx}`);
            searchTerms.push(`${unCameledSkill} ${sfx}`);
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
