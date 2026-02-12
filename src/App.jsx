import { useState } from 'react';
import { AssessmentProvider } from './context/AssessmentContext';
import Stepper from './components/Stepper';
import ChildInfo from './screens/ChildInfo';
import SkillAssessment from './screens/SkillAssessment';
import Review from './screens/Review';
import PatientDashboard from './screens/PatientDashboard';

function AppContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [viewMode, setViewMode] = useState('assessment'); // 'assessment' or 'dashboard'
  const totalSteps = 9;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const jumpToStep = (stepOrCategory) => {
    const stepMap = {
      'info': 1,
      'gross': 2,
      'fine': 3,
      'language': 4,
      'communication': 5,
      'social': 6,
      'adl': 7,
      'cognitive': 8
    };
    if (typeof stepOrCategory === 'string' && stepMap[stepOrCategory]) {
      setCurrentStep(stepMap[stepOrCategory]);
    } else if (typeof stepOrCategory === 'number') {
      setCurrentStep(stepOrCategory);
    }
  };

  const renderScreen = () => {
    if (viewMode === 'dashboard') {
      return <PatientDashboard onBack={() => setViewMode('assessment')} />;
    }

    switch (currentStep) {
      case 1:
        return <ChildInfo onNext={nextStep} />;
      case 2:
        return <SkillAssessment category="gross" onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <SkillAssessment category="fine" onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <SkillAssessment category="language" onNext={nextStep} onBack={prevStep} />;
      case 5:
        return <SkillAssessment category="communication" onNext={nextStep} onBack={prevStep} />;
      case 6:
        return <SkillAssessment category="social" onNext={nextStep} onBack={prevStep} />;
      case 7:
        return <SkillAssessment category="adl" onNext={nextStep} onBack={prevStep} />;
      case 8:
        return <SkillAssessment category="cognitive" onNext={nextStep} onBack={prevStep} />;
      case 9:
        return <Review onBack={prevStep} onJumpToStep={jumpToStep} />;
      default:
        return <ChildInfo onNext={nextStep} />;
    }
  };

  return (
    <div className="container">
      <header className="assessment-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>SRI SARASWATHI VIDHYALAYA</h1>
          <p>Inclusive Education Entry Level Assessment Form</p>
        </div>
        <button
          onClick={() => setViewMode(viewMode === 'assessment' ? 'dashboard' : 'assessment')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: viewMode === 'assessment' ? 'var(--color-primary)' : 'var(--color-secondary)',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          {viewMode === 'assessment' ? 'View Patient History' : 'New Assessment'}
        </button>
      </header>

      <main className="card">
        {viewMode === 'assessment' && currentStep <= totalSteps && (
          <Stepper currentStep={currentStep} totalSteps={totalSteps} />
        )}
        {renderScreen()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AssessmentProvider>
      <AppContent />
    </AssessmentProvider>
  );
}

export default App;
