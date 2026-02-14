import { useAssessment } from '../context/AssessmentContext';
import SkillRow from '../components/SkillRow';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';

import { getLabel } from '../utils/labelMapping';

const sectionInfo = {
    gross: {
        title: "Gross Motor Skills",
        description: "Assess large muscle movements and physical abilities.",
        keys: ["walksIndependently", "runsSteadily", "jumpsForward", "hopsOneFoot", "climbsStairs", "walksBackward", "throwsBall", "catchesBall", "kicksBall", "balancesOneFoot"]
    },
    fine: {
        title: "Fine Motor Skills",
        description: "Assess small muscle movements and hand-eye coordination.",
        keys: ["holdsPencil", "drawsShapes", "cutsScissors", "completesPuzzles", "stringsBeads", "buildsTower", "opensContainers", "turnsPages", "manipulatesObjects", "foldsPaper"]
    },
    language: {
        title: "Language Skills",
        description: "Assess communication and comprehension abilities.",
        keys: ["identifiesObjects", "namesColors", "namesBodyParts", "answersWh", "followsTwoStep", "speaksSentences", "tellsStories", "usesPlurals", "understandsOpposites", "singsRhymes"]
    },
    communication: {
        title: "Communication Skills",
        description: "Assess non-verbal and early verbal communication.",
        keys: ["initiatesConversation", "maintainsEyeContact", "takesTurns", "asksForHelp", "respondsGreetings", "expressesNeeds", "usesFacialExpressions", "usesGestures", "appropriateTone", "pretendPlaySpeech"]
    },
    social: {
        title: "Social Interaction Skills",
        description: "Assess social behavior and interaction with others.",
        keys: ["greetsPeers", "parallelPlay", "sharesMaterials", "takesTurnsGroup", "followsRules", "waitsPatiently", "expressesFeelings", "showsEmpathy", "resolvesConflicts", "joinsGroup"]
    },
    adl: {
        title: "Activities of Daily Living (ADL)",
        description: "Assess self-care and daily living skills.",
        keys: ["toileting", "washesHands", "brushesTeeth", "eatsIndependently", "dresses", "wearsShoes", "zipsBag", "opensLunchbox", "packsBag", "recognizesBelongings"]
    },
    cognitive: {
        title: "Cognitive Skills",
        description: "Assess intellectual development and problem-solving.",
        keys: ["identifiesNumbers", "countsObjects", "matchesShapes", "recognizesPatterns", "sameVsDifferent", "sortsObjects", "recallsItems", "completesTasks", "timeConcepts", "taskAttention"]
    }
};

const SkillAssessment = ({ category, onNext, onBack }) => {
    const { state, updateSkill } = useAssessment();
    const screenData = sectionInfo[category];
    const currentSkills = state[category];

    // Check if all skills have a value (Yes/No)
    const isComplete = screenData.keys.every(
        key => currentSkills[key].value !== ""
    );

    const handleUpdate = (skillKey, field, value) => {
        updateSkill(category, skillKey, field, value);

        // Auto-focus logic: If setting a value (not comment), move to next
        if (field === 'value' && value) {
            const keys = screenData.keys;
            const currentIndex = keys.indexOf(skillKey);
            if (currentIndex < keys.length - 1) {
                const nextKey = keys[currentIndex + 1];
                const nextLabel = getLabel(category, nextKey);
                const nextElementId = `toggle-${nextLabel.replace(/\s+/g, '-').toLowerCase()}`;

                // Small timeout to allow render to complete
                setTimeout(() => {
                    const nextElement = document.getElementById(nextElementId);
                    if (nextElement) {
                        const firstButton = nextElement.querySelector('button');
                        if (firstButton) {
                            firstButton.focus();
                            firstButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }
                }, 100);
            }
        }
    };

    return (
        <div>
            <SectionHeader title={screenData.title} description={screenData.description} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {screenData.keys.map((key) => (
                    <SkillRow
                        key={key}
                        label={getLabel(category, key)}
                        value={currentSkills[key].value}
                        comment={currentSkills[key].comment}
                        onUpdate={(field, val) => handleUpdate(key, field, val)}
                    />
                ))}
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px', marginBottom: '48px' }}>
                <div style={{ flex: 1 }}>
                    <Button variant="secondary" onClick={onBack}>
                        Back
                    </Button>
                </div>
                <div style={{ flex: 2 }}>
                    <Button onClick={onNext} disabled={!isComplete}>
                        Next Section
                    </Button>
                </div>
            </div>

            {!isComplete && (
                <div style={{
                    textAlign: 'center',
                    color: 'var(--color-primary-dark)',
                    backgroundColor: 'var(--color-secondary)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: '500'
                }}>
                    Please complete all items to proceed.
                </div>
            )}
        </div>
    );
};

export default SkillAssessment;
