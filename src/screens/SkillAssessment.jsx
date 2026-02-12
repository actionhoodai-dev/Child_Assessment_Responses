import { useAssessment } from '../context/AssessmentContext';
import SkillRow from '../components/SkillRow';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';

const skillLabels = {
    gross: {
        title: "Gross Motor Skills",
        description: "Assess large muscle movements and physical abilities.",
        items: {
            walksIndependently: "Walks independently",
            runsSteadily: "Runs steadily",
            jumpsForward: "Jumps forward with both feet",
            hopsOneFoot: "Hops on one foot",
            climbsStairs: "Climbs stairs (alternating feet)",
            walksBackward: "Walks backward",
            throwsBall: "Throws a ball overhand",
            catchesBall: "Catches a large ball",
            kicksBall: "Kicks a stationary ball",
            balancesOneFoot: "Balances on one foot (5 seconds)"
        }
    },
    fine: {
        title: "Fine Motor Skills",
        description: "Assess small muscle movements and hand-eye coordination.",
        items: {
            holdsPencil: "Holds pencil correctly (tripod grasp)",
            drawsShapes: "Draws simple shapes (circle, square)",
            cutsScissors: "Cuts along a line with scissors",
            completesPuzzles: "Completes simple puzzles",
            stringsBeads: "Strings beads",
            buildsTower: "Builds a tower of blocks",
            opensContainers: "Opens jars/containers",
            turnsPages: "Turns pages of a book one by one",
            manipulatesObjects: "Manipulates small objects",
            foldsPaper: "Folds paper in half"
        }
    },
    language: {
        title: "Language Skills",
        description: "Assess communication and comprehension abilities.",
        items: {
            identifiesObjects: "Identifies common objects",
            namesColors: "Names primary colors",
            namesBodyParts: "Names body parts",
            answersWh: "Answers simple 'Who', 'What', 'Where' questions",
            followsTwoStep: "Follows two-step directions",
            speaksSentences: "Speaks in complete sentences (4-5 words)",
            tellsStories: "Tells a simple story or recounts an event",
            usesPlurals: "Uses plurals correctly",
            understandsOpposites: "Understands opposites (big/small, up/down)",
            singsRhymes: "Sings songs or nursery rhymes"
        }
    },
    communication: {
        title: "Communication Skills",
        description: "Assess non-verbal and early verbal communication.",
        items: {
            initiatesConversation: "Initiates conversation",
            maintainsEyeContact: "Maintains eye contact",
            takesTurns: "Takes turns in conversation",
            asksForHelp: "Asks for help when needed",
            respondsGreetings: "Responds to greetings",
            expressesNeeds: "Expresses needs clearly",
            usesFacialExpressions: "Uses appropriate facial expressions",
            usesGestures: "Uses gestures to communicate",
            appropriateTone: "Uses appropriate tone of voice",
            pretendPlaySpeech: "Uses speech during pretend play"
        }
    },
    social: {
        title: "Social Interaction Skills",
        description: "Assess social behavior and interaction with others.",
        items: {
            greetsPeers: "Greets peers independently",
            parallelPlay: "Engages in parallel play",
            sharesMaterials: "Shares materials with others",
            takesTurnsGroup: "Takes turns in group activities",
            followsRules: "Follows classroom/group rules",
            waitsPatiently: "Waits patiently for turn",
            expressesFeelings: "Expresses feelings appropriately",
            showsEmpathy: "Shows empathy towards others",
            resolvesConflicts: "Resolves conflicts with peers",
            joinsGroup: "Joins group activities willingly"
        }
    },
    adl: {
        title: "Activities of Daily Living (ADL)",
        description: "Assess self-care and daily living skills.",
        items: {
            toileting: "Manages toileting independently",
            washesHands: "Washes hands independently",
            brushesTeeth: "Brushes teeth",
            eatsIndependently: "Eats independently",
            dresses: "Dresses self",
            wearsShoes: "Puts on shoes",
            zipsBag: "Zips/unzips bag",
            opensLunchbox: "Opens lunchbox/containers",
            packsBag: "Packs own bag",
            recognizesBelongings: "Recognizes personal belongings"
        }
    },
    cognitive: {
        title: "Cognitive Skills",
        description: "Assess intellectual development and problem-solving.",
        items: {
            identifiesNumbers: "Identifies numbers",
            countsObjects: "Counts objects accurately",
            matchesShapes: "Matches shapes",
            recognizesPatterns: "Recognizes simple patterns",
            sameVsDifferent: "Understands concept of Same vs Different",
            sortsObjects: "Sorts objects by category/attribute",
            recallsItems: "Recalls missing items from a set",
            completesTasks: "Completes assigned tasks",
            timeConcepts: "Understands basic time concepts (now, later)",
            taskAttention: "Sustains attention on task"
        }
    }
};

const SkillAssessment = ({ category, onNext, onBack }) => {
    const { state, updateSkill } = useAssessment();
    const screenData = skillLabels[category];
    const currentSkills = state[category];

    // Check if all skills have a value (Yes/No)
    const isComplete = Object.keys(screenData.items).every(
        key => currentSkills[key].value !== ""
    );

    const handleUpdate = (skillKey, field, value) => {
        updateSkill(category, skillKey, field, value);

        // Auto-focus logic: If setting a value (not comment), move to next
        if (field === 'value' && value) {
            const keys = Object.keys(screenData.items);
            const currentIndex = keys.indexOf(skillKey);
            if (currentIndex < keys.length - 1) {
                const nextKey = keys[currentIndex + 1];
                const nextElementId = `toggle-${screenData.items[nextKey].replace(/\s+/g, '-').toLowerCase()}`;

                // Small timeout to allow render to complete
                setTimeout(() => {
                    const nextElement = document.getElementById(nextElementId);
                    if (nextElement) {
                        // Find the first button inside the toggle group
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
                {Object.entries(screenData.items).map(([key, label]) => (
                    <SkillRow
                        key={key}
                        label={label}
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
                    Please complete all {screenData.items.length} items to proceed.
                </div>
            )}
        </div>
    );
};

export default SkillAssessment;
