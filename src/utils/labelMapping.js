
/**
 * AUTHORITATIVE LABEL MAPPING
 * 
 * This object maps Internal Database Keys (Stable System Identifiers)
 * to Client-Facing Wording (Exact Word Document Wording).
 * 
 * DO NOT MODIFY WORDING OR IDENTIFIERS.
 */

export const LABEL_MAPPING = {
    // Gross Motor Skills
    "Gross_Walks_Independently": "Walks independently without support",
    "Gross_Runs_Steadily": "Runs steadily without tripping",
    "Gross_Jumps_Forward": "Jumps forward with both feet",
    "Gross_Hops_On_One_Foot": "Hops on one foot",
    "Gross_Climbs_Stairs": "Climbs stairs with alternating feet",
    "Gross_Walks_Backward": "Walks backward in a straight line",
    "Gross_Throws_Ball": "Throws a ball overhead",
    "Gross_Catches_Ball": "Catches a ball with both hands",
    "Gross_Kicks_Ball": "Kicks a ball forward",
    "Gross_Balances_On_One_Foot": "Balances on one foot for 5 seconds",

    // Fine Motor Skills
    "Fine_Holds_Pencil": "Holds pencil with proper grip",
    "Fine_Draws_Shapes": "Draws straight lines and simple shapes",
    "Fine_Cuts_With_Scissors": "Cuts paper along a line with scissors",
    "Fine_Completes_Puzzles": "Completes simple puzzles (6–12 pieces)",
    "Fine_Strings_Beads": "Strings beads/laces large buttons",
    "Fine_Builds_Block_Tower": "Builds a tower with 10+ blocks",
    "Fine_Opens_Containers": "Opens and closes containers",
    "Fine_Turns_Pages": "Turns pages in a book one at a time",
    "Fine_Manipulates_Small_Objects": "Manipulates small toys/buttons",
    "Fine_Folds_Paper": "Folds paper in half",

    // Language Skills
    "Language_Identifies_Objects": "Identifies common objects",
    "Language_Names_Colors": "Names basic colors",
    "Language_Names_Body_Parts": "Names body parts",
    "Language_Answers_Wh_Questions": "Answers simple 'wh' questions",
    "Language_Follows_Two_Step": "Follows two-step directions",
    "Language_Speaks_Sentences": "Speaks in sentences of 4–6 words",
    "Language_Tells_Stories": "Tells short stories or describes pictures",
    "Language_Uses_Plurals": "Uses plurals and past tense appropriately",
    "Language_Understands_Opposites": "Understands opposites",
    "Language_Sings_Rhymes": "Sings or recites rhymes/songs",

    // Communication Skills
    "Communication_Initiates_Conversation": "Initiates conversation with others",
    "Communication_Maintains_Eye_Contact": "Maintains eye contact during interactions",
    "Communication_Takes_Turns": "Takes turns in conversation",
    "Communication_Asks_For_Help": "Asks for help or clarification",
    "Communication_Responds_To_Greetings": "Responds to greetings",
    "Communication_Expresses_Needs": "Expresses needs clearly",
    "Communication_Uses_Facial_Expressions": "Uses facial expressions appropriately",
    "Communication_Uses_Gestures": "Understands and uses simple gestures",
    "Communication_Appropriate_Tone": "Uses appropriate volume and tone",
    "Communication_Pretend_Play_Speech": "Engages in pretend play involving speech",

    // Social Interaction Skills
    "Social_Greets_Peers": "Greets peers and adults appropriately",
    "Social_Parallel_Play": "Engages in parallel and cooperative play",
    "Social_Shares_Materials": "Shares materials and toys",
    "Social_Takes_Turns_Group": "Takes turns during group activities",
    "Social_Follows_Rules": "Follows group rules or routines",
    "Social_Waits_Patiently": "Waits for their turn patiently",
    "Social_Expresses_Feelings": "Expresses feelings appropriately",
    "Social_Shows_Empathy": "Shows empathy toward others",
    "Social_Resolves_Conflicts": "Resolves simple conflicts with support",
    "Social_Joins_Group": "Joins group activities willingly",

    // Activities of Daily Living (ADL)
    "ADL_Toileting": "Toilets independently or with minimal help",
    "ADL_Washes_Hands": "Washes hands with soap",
    "ADL_Brushes_Teeth": "Brushes teeth with supervision",
    "ADL_Eats_Independently": "Eats independently using spoon/fork",
    "ADL_Dresses": "Puts on and removes clothes",
    "ADL_Wears_Shoes": "Puts on socks and shoes",
    "ADL_Zips_Bag": "Zips/unzips jacket or bag",
    "ADL_Opens_Lunchbox": "Opens lunchbox/water bottle",
    "ADL_Packs_Bag": "Packs/unpacks school bag",
    "ADL_Recognizes_Belongings": "Recognizes personal belongings",

    // Cognitive Skills
    "Cognitive_Identifies_Numbers": "Identifies numbers 1–10",
    "Cognitive_Counts_Objects": "Counts objects (up to 10)",
    "Cognitive_Matches_Shapes": "Matches similar shapes/colors",
    "Cognitive_Recognizes_Patterns": "Recognizes basic patterns",
    "Cognitive_Same_vs_Different": "Understands 'same' vs 'different'",
    "Cognitive_Sorts_Objects": "Sorts objects by color/size/shape",
    "Cognitive_Recalls_Items": "Remembers and recalls 2–3 items",
    "Cognitive_Completes_Tasks": "Completes simple puzzles or tasks",
    "Cognitive_Time_Concepts": "Understands basic time concepts",
    "Cognitive_Task_Attention": "Attends to a task for 10 minutes",
};

// Helper to cross-reference internal app keys to Database keys
const INTERNAL_TO_DB_MAP = {
    gross: {
        walksIndependently: "Gross_Walks_Independently",
        runsSteadily: "Gross_Runs_Steadily",
        jumpsForward: "Gross_Jumps_Forward",
        hopsOneFoot: "Gross_Hops_On_One_Foot",
        climbsStairs: "Gross_Climbs_Stairs",
        walksBackward: "Gross_Walks_Backward",
        throwsBall: "Gross_Throws_Ball",
        catchesBall: "Gross_Catches_Ball",
        kicksBall: "Gross_Kicks_Ball",
        balancesOneFoot: "Gross_Balances_On_One_Foot",
    },
    fine: {
        holdsPencil: "Fine_Holds_Pencil",
        drawsShapes: "Fine_Draws_Shapes",
        cutsScissors: "Fine_Cuts_With_Scissors",
        completesPuzzles: "Fine_Completes_Puzzles",
        stringsBeads: "Fine_Strings_Beads",
        buildsTower: "Fine_Builds_Block_Tower",
        opensContainers: "Fine_Opens_Containers",
        turnsPages: "Fine_Turns_Pages",
        manipulatesObjects: "Fine_Manipulates_Small_Objects",
        foldsPaper: "Fine_Folds_Paper",
    },
    language: {
        identifiesObjects: "Language_Identifies_Objects",
        namesColors: "Language_Names_Colors",
        namesBodyParts: "Language_Names_Body_Parts",
        answersWh: "Language_Answers_Wh_Questions",
        followsTwoStep: "Language_Follows_Two_Step",
        speaksSentences: "Language_Speaks_Sentences",
        tellsStories: "Language_Tells_Stories",
        usesPlurals: "Language_Uses_Plurals",
        understandsOpposites: "Language_Understands_Opposites",
        singsRhymes: "Language_Sings_Rhymes",
    },
    communication: {
        initiatesConversation: "Communication_Initiates_Conversation",
        maintainsEyeContact: "Communication_Maintains_Eye_Contact",
        takesTurns: "Communication_Takes_Turns",
        asksForHelp: "Communication_Asks_For_Help",
        respondsGreetings: "Communication_Responds_To_Greetings",
        expressesNeeds: "Communication_Expresses_Needs",
        usesFacialExpressions: "Communication_Uses_Facial_Expressions",
        usesGestures: "Communication_Uses_Gestures",
        appropriateTone: "Communication_Appropriate_Tone",
        pretendPlaySpeech: "Communication_Pretend_Play_Speech",
    },
    social: {
        greetsPeers: "Social_Greets_Peers",
        parallelPlay: "Social_Parallel_Play",
        sharesMaterials: "Social_Shares_Materials",
        takesTurnsGroup: "Social_Takes_Turns_Group",
        followsRules: "Social_Follows_Rules",
        waitsPatiently: "Social_Waits_Patiently",
        expressesFeelings: "Social_Expresses_Feelings",
        showsEmpathy: "Social_Shows_Empathy",
        resolvesConflicts: "Social_Resolves_Conflicts",
        joinsGroup: "Social_Joins_Group",
    },
    adl: {
        toileting: "ADL_Toileting",
        washesHands: "ADL_Washes_Hands",
        brushesTeeth: "ADL_Brushes_Teeth",
        eatsIndependently: "ADL_Eats_Independently",
        dresses: "ADL_Dresses",
        wearsShoes: "ADL_Wears_Shoes",
        zipsBag: "ADL_Zips_Bag",
        opensLunchbox: "ADL_Opens_Lunchbox",
        packsBag: "ADL_Packs_Bag",
        recognizesBelongings: "ADL_Recognizes_Belongings",
    },
    cognitive: {
        identifiesNumbers: "Cognitive_Identifies_Numbers",
        countsObjects: "Cognitive_Counts_Objects",
        matchesShapes: "Cognitive_Matches_Shapes",
        recognizesPatterns: "Cognitive_Recognizes_Patterns",
        sameVsDifferent: "Cognitive_Same_vs_Different",
        sortsObjects: "Cognitive_Sorts_Objects",
        recallsItems: "Cognitive_Recalls_Items",
        completesTasks: "Cognitive_Completes_Tasks",
        timeConcepts: "Cognitive_Time_Concepts",
        taskAttention: "Cognitive_Task_Attention",
    },
};

/**
 * Resolves a display label for a given category and internal key.
 * Fallbacks to the internal key if no mapping is found.
 */
export const getLabel = (category, internalKey) => {
    const dbKey = INTERNAL_TO_DB_MAP[category]?.[internalKey];
    if (dbKey && LABEL_MAPPING[dbKey]) {
        return LABEL_MAPPING[dbKey];
    }
    // Fallback: humanize the internal key
    return internalKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};
