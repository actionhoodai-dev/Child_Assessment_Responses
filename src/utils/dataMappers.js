
/**
 * Maps a flat record (e.g., from Google Sheets) to the nested assessment state structure.
 * This is now perfectly aligned with the App Script backend precisely provided by the USER.
 */
export const mapRecordToAssessmentState = (record) => {
    if (!record) return null;

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

    // Alphanumeric map for fallback matching
    const normalizedKeys = {};
    Object.keys(record).forEach(key => {
        const stripped = key.toLowerCase().replace(/[^a-z0-9]/g, '');
        normalizedKeys[stripped] = key;
    });

    const findValue = (category, scriptSkill, suffix = "") => {
        // App Script uses Category_Skill or Category_Skill_Comment
        const target = suffix ? `${category}_${scriptSkill}_${suffix}` : `${category}_${scriptSkill}`;

        // Try exact match
        if (record[target] !== undefined && record[target] !== "") return normalizeValue(record[target]);

        // Try fuzzy match on the specific header name
        const strippedTarget = target.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (normalizedKeys[strippedTarget]) {
            return normalizeValue(record[normalizedKeys[strippedTarget]]);
        }

        return "";
    };

    // Basic Info Mapping
    const state = {
        patientId: record.Patient_ID || record["Patient_ID"] || record.patientId || "",
        childName: record.Child_Name || record["Child_Name"] || record.childName || "",
        dob: record.DOB || record["DOB"] || record.dob || "",
        age: record.Age || record["Age"] || record.age || "",
        gender: record.Gender || record["Gender"] || record.gender || "",
        assessmentDate: record.Date_of_Assessment || record["Date_of_Assessment"] || record.assessmentDate || record.Date_of_Assess || "",
        assessorName: record.Assessor_Name || record["Assessor_Name"] || record.assessorName || "",
    };

    // Precision Mapping based on USER provided App Script
    const map = {
        gross: {
            walksIndependently: "Walks_Independently",
            runsSteadily: "Runs_Steadily",
            jumpsForward: "Jumps_Forward",
            hopsOneFoot: "Hops_On_One_Foot",
            climbsStairs: "Climbs_Stairs",
            walksBackward: "Walks_Backward",
            throwsBall: "Throws_Ball",
            catchesBall: "Catches_Ball",
            kicksBall: "Kicks_Ball",
            balancesOneFoot: "Balances_On_One_Foot"
        },
        fine: {
            holdsPencil: "Holds_Pencil",
            drawsShapes: "Draws_Shapes",
            cutsScissors: "Cuts_With_Scissors",
            completesPuzzles: "Completes_Puzzles",
            stringsBeads: "Strings_Beads",
            buildsTower: "Builds_Block_Tower",
            opensContainers: "Opens_Containers",
            turnsPages: "Turns_Pages",
            manipulatesObjects: "Manipulates_Small_Objects",
            foldsPaper: "Folds_Paper"
        },
        language: {
            identifiesObjects: "Identifies_Objects",
            namesColors: "Names_Colors",
            namesBodyParts: "Names_Body_Parts",
            answersWh: "Answers_Wh_Questions",
            followsTwoStep: "Follows_Two_Step",
            speaksSentences: "Speaks_Sentences",
            tellsStories: "Tells_Stories",
            usesPlurals: "Uses_Plurals",
            understandsOpposites: "Understands_Opposites",
            singsRhymes: "Sings_Rhymes"
        },
        communication: {
            initiatesConversation: "Initiates_Conversation",
            maintainsEyeContact: "Maintains_Eye_Contact",
            takesTurns: "Takes_Turns",
            asksForHelp: "Asks_For_Help",
            respondsGreetings: "Responds_To_Greetings",
            expressesNeeds: "Expresses_Needs",
            usesFacialExpressions: "Uses_Facial_Expressions",
            usesGestures: "Uses_Gestures",
            appropriateTone: "Appropriate_Tone",
            pretendPlaySpeech: "Pretend_Play_Speech"
        },
        social: {
            greetsPeers: "Greets_Peers",
            parallelPlay: "Parallel_Play",
            sharesMaterials: "Shares_Materials",
            takesTurnsGroup: "Takes_Turns_Group",
            followsRules: "Follows_Rules",
            waitsPatiently: "Waits_Patiently",
            expressesFeelings: "Expresses_Feelings",
            showsEmpathy: "Shows_Empathy",
            resolvesConflicts: "Resolves_Conflicts",
            joinsGroup: "Joins_Group"
        },
        adl: {
            toileting: "Toileting",
            washesHands: "Washes_Hands",
            brushesTeeth: "Brushes_Teeth",
            eatsIndependently: "Eats_Independently",
            dresses: "Dresses",
            wearsShoes: "Wears_Shoes",
            zipsBag: "Zips_Bag",
            opensLunchbox: "Opens_Lunchbox",
            packsBag: "Packs_Bag",
            recognizesBelongings: "Recognizes_Belongings"
        },
        cognitive: {
            identifiesNumbers: "Identifies_Numbers",
            countsObjects: "Counts_Objects",
            matchesShapes: "Matches_Shapes",
            recognizesPatterns: "Recognizes_Patterns",
            sameVsDifferent: "Same_vs_Different",
            sortsObjects: "Sorts_Objects",
            recallsItems: "Recalls_Items",
            completesTasks: "Completes_Tasks",
            timeConcepts: "Time_Concepts",
            taskAttention: "Task_Attention"
        }
    };

    // Category names used in Script headers
    const scriptCategories = {
        gross: "Gross",
        fine: "Fine",
        language: "Language",
        communication: "Communication",
        social: "Social",
        adl: "ADL",
        cognitive: "Cognitive"
    };

    // Execute precision mapping
    Object.keys(map).forEach(category => {
        state[category] = {};
        const scriptCat = scriptCategories[category];
        Object.keys(map[category]).forEach(internalKey => {
            const scriptSkill = map[category][internalKey];
            state[category][internalKey] = {
                value: findValue(scriptCat, scriptSkill, ""),
                comment: findValue(scriptCat, scriptSkill, "Comment")
            };
        });
    });

    return state;
};
