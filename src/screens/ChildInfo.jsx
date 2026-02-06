import { useAssessment } from '../context/AssessmentContext';
import Input from '../components/Input';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';

const ChildInfo = ({ onNext }) => {
    const { state, updateInfo } = useAssessment();

    const handleChange = (e) => {
        updateInfo(e.target.name, e.target.value);
    };

    const isValid = state.childName && state.dob && state.age && state.gender && state.assessorName;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isValid) onNext();
    };

    return (
        <form onSubmit={handleSubmit}>
            <SectionHeader
                title="Child Information"
                description="Please provide details about the child and assessment session."
            />

            <Input
                label="Child Name"
                name="childName"
                value={state.childName}
                onChange={handleChange}
                placeholder="First and Last Name"
                required
            />

            <Input
                label="Date of Birth"
                type="date"
                name="dob"
                value={state.dob}
                onChange={handleChange}
                required
            />

            <Input
                label="Age"
                name="age"
                type="number"
                value={state.age}
                onChange={handleChange}
                placeholder="Age in years"
                required
            />

            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '18px', fontWeight: '600' }}>
                    Gender <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <select
                    name="gender"
                    value={state.gender}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '18px',
                        borderRadius: '8px',
                        border: '2px solid var(--color-border)',
                        backgroundColor: '#fff'
                    }}
                    required
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <Input
                label="Date of Assessment"
                type="date"
                name="assessmentDate"
                value={state.assessmentDate}
                onChange={handleChange}
                required
            />

            <Input
                label="Assessor Name"
                name="assessorName"
                value={state.assessorName}
                onChange={handleChange}
                placeholder="Your Name"
                required
            />

            <div style={{ marginTop: '32px' }}>
                <Button type="submit" disabled={!isValid}>
                    Next: Gross Motor Skills
                </Button>
            </div>
        </form>
    );
};

export default ChildInfo;
