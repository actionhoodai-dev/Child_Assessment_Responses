import { createContext, useContext, useReducer } from 'react';

const AssessmentContext = createContext();

const initialSkillState = { value: "", comment: "" };

const initialState = {
    // Screen 1: Child Information
    childName: "",
    dob: "",
    age: "",
    gender: "",
    assessmentDate: new Date().toISOString().split('T')[0], // Default to today
    assessorName: "",

    // Screen 2: Gross Motor Skills
    gross: {
        walksIndependently: { ...initialSkillState },
        runsSteadily: { ...initialSkillState },
        jumpsForward: { ...initialSkillState },
        hopsOneFoot: { ...initialSkillState },
        climbsStairs: { ...initialSkillState },
        walksBackward: { ...initialSkillState },
        throwsBall: { ...initialSkillState },
        catchesBall: { ...initialSkillState },
        kicksBall: { ...initialSkillState },
        balancesOneFoot: { ...initialSkillState },
    },

    // Screen 3: Fine Motor Skills
    fine: {
        holdsPencil: { ...initialSkillState },
        drawsShapes: { ...initialSkillState },
        cutsScissors: { ...initialSkillState },
        completesPuzzles: { ...initialSkillState },
        stringsBeads: { ...initialSkillState },
        buildsTower: { ...initialSkillState },
        opensContainers: { ...initialSkillState },
        turnsPages: { ...initialSkillState },
        manipulatesObjects: { ...initialSkillState },
        foldsPaper: { ...initialSkillState },
    },

    // Screen 4: Language Skills
    language: {
        identifiesObjects: { ...initialSkillState },
        namesColors: { ...initialSkillState },
        namesBodyParts: { ...initialSkillState },
        answersWh: { ...initialSkillState },
        followsTwoStep: { ...initialSkillState },
        speaksSentences: { ...initialSkillState },
        tellsStories: { ...initialSkillState },
        usesPlurals: { ...initialSkillState },
        understandsOpposites: { ...initialSkillState },
        singsRhymes: { ...initialSkillState },
    },
};

const assessmentReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_INFO':
            return {
                ...state,
                [action.field]: action.value,
            };
        case 'UPDATE_SKILL':
            // action.category = 'gross' | 'fine' | 'language'
            // action.skill = 'walksIndependently'
            // action.key = 'value' | 'comment'
            // action.payload = 'Yes' | 'No' | 'some comment'
            return {
                ...state,
                [action.category]: {
                    ...state[action.category],
                    [action.skill]: {
                        ...state[action.category][action.skill],
                        [action.key]: action.payload,
                    },
                },
            };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
};

export const AssessmentProvider = ({ children }) => {
    const [state, dispatch] = useReducer(assessmentReducer, initialState);

    const updateInfo = (field, value) => {
        dispatch({ type: 'UPDATE_INFO', field, value });
    };

    const updateSkill = (category, skill, key, payload) => {
        dispatch({ type: 'UPDATE_SKILL', category, skill, key, payload });
    };

    const resetAssessment = () => {
        dispatch({ type: 'RESET' });
    };

    return (
        <AssessmentContext.Provider value={{ state, updateInfo, updateSkill, resetAssessment }}>
            {children}
        </AssessmentContext.Provider>
    );
};

export const useAssessment = () => {
    const context = useContext(AssessmentContext);
    if (!context) {
        throw new Error('useAssessment must be used within an AssessmentProvider');
    }
    return context;
};
