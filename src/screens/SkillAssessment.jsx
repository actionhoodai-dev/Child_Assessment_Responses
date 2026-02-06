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
    };

    return (
        <div>
            <SectionHeader title={screenData.title} description={screenData.description} />

            {Object.entries(screenData.items).map(([key, label]) => (
                <SkillRow
                    key={key}
                    label={label}
                    value={currentSkills[key].value}
                    comment={currentSkills[key].comment}
                    onUpdate={(field, val) => handleUpdate(key, field, val)}
                />
            ))}

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px', marginBottom: '48px' }}>
                <div style={{ flex: 1 }}>
                    <Button variant="secondary" onClick={onBack}>
                        Back
                    </Button>
                </div>
                <div style={{ flex: 2 }}>
                    <Button onClick={onNext} disabled={!isComplete}>
                        Next
                    </Button>
                </div>
            </div>

            {!isComplete && (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '14px' }}>
                    Please complete all items to proceed.
                </p>
            )}
        </div>
    );
};

export default SkillAssessment;
