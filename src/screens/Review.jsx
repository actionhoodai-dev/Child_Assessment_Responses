import { useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { saveAssessment } from '../services/api';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';

const ReviewSection = ({ title, children, onEdit }) => (
    <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', color: 'var(--color-primary)' }}>{title}</h3>
            <button
                onClick={onEdit}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: '600', cursor: 'pointer', fontSize: '16px' }}
            >
                Edit
            </button>
        </div>
        {children}
    </div>
);

const Review = ({ onBack, onJumpToStep }) => {
    const { state, resetAssessment } = useAssessment();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            await saveAssessment(state);
            setIsSuccess(true);
        } catch (err) {
            setError("Failed to save data. Please check your internet connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div style={{ textAlign: 'center', padding: '48px 16px' }}>
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>✅</div>
                <h2 style={{ color: 'var(--color-success)' }}>Assessment Saved!</h2>
                <p style={{ marginBottom: '32px' }}>The assessment for <strong>{state.childName}</strong> has been successfully recorded.</p>
                <Button onClick={() => { window.location.reload(); }}>
                    Start New Assessment
                </Button>
            </div>
        );
    }

    const renderSkillSummary = (category, categoryLabel) => {
        const skills = state[category];
        return (
            <ReviewSection title={categoryLabel} onEdit={() => onJumpToStep(category)}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {Object.entries(skills).map(([key, data]) => (
                        <li key={key} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                            <span style={{ fontWeight: '600', color: data.value === 'Yes' ? 'var(--color-success)' : 'var(--color-error)' }}>
                                {data.value}
                            </span>
                        </li>
                    ))}
                </ul>
            </ReviewSection>
        );
    };

    return (
        <div>
            <SectionHeader title="Review & Submit" description="Please review all entries before submitting." />

            <ReviewSection title="Child Information" onEdit={() => onJumpToStep('info')}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div><strong>Name:</strong> {state.childName}</div>
                    <div><strong>Age:</strong> {state.age}</div>
                    <div><strong>DOB:</strong> {state.dob}</div>
                    <div><strong>Gender:</strong> {state.gender}</div>
                </div>
            </ReviewSection>

            {renderSkillSummary('gross', 'Gross Motor Skills')}
            {renderSkillSummary('fine', 'Fine Motor Skills')}
            {renderSkillSummary('language', 'Language Skills')}
            {renderSkillSummary('communication', 'Communication Skills')}
            {renderSkillSummary('social', 'Social Interaction Skills')}
            {renderSkillSummary('adl', 'Activities of Daily Living')}
            {renderSkillSummary('cognitive', 'Cognitive Skills')}

            {error && (
                <div style={{ padding: '16px', backgroundColor: '#FDECEA', color: 'var(--color-error)', borderRadius: '8px', marginBottom: '24px' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px', marginBottom: '48px' }}>
                <div style={{ flex: 1 }}>
                    <Button variant="secondary" onClick={onBack} disabled={isSubmitting}>
                        Back
                    </Button>
                </div>
                <div style={{ flex: 2 }}>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Review;
