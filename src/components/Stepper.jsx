const Stepper = ({ currentStep, totalSteps }) => {
    return (
        <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>
                    Step {currentStep} of {totalSteps}
                </span>
                <span style={{ color: 'var(--color-text-muted)' }}>
                    {Math.round((currentStep / totalSteps) * 100)}%
                </span>
            </div>
            <div style={{ height: '8px', width: '100%', backgroundColor: '#E0E0E0', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                    style={{
                        height: '100%',
                        width: `${(currentStep / totalSteps) * 100}%`,
                        backgroundColor: 'var(--color-primary)',
                        transition: 'width 0.3s ease-out'
                    }}
                />
            </div>
        </div>
    );
};

export default Stepper;
