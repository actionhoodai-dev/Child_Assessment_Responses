import { useState } from 'react';
import { AssessmentProvider } from './context/AssessmentContext';
import Stepper from './components/Stepper';
import ChildInfo from './screens/ChildInfo';
import SkillAssessment from './screens/SkillAssessment';
import Review from './screens/Review';

function AppContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const jumpToStep = (stepOrCategory) => {
    const stepMap = {
      'info': 1,
      'gross': 2,
      'fine': 3,
      'language': 4
    };
    if (typeof stepOrCategory === 'string' && stepMap[stepOrCategory]) {
      setCurrentStep(stepMap[stepOrCategory]);
    } else if (typeof stepOrCategory === 'number') {
      setCurrentStep(stepOrCategory);
    }
  };

  const renderScreen = () => {
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
        return <Review onBack={prevStep} onJumpToStep={jumpToStep} />;
      default:
        return <ChildInfo onNext={nextStep} />;
    }
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>Child Assessment</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '18px' }}>Entry Level Scale</p>
      </header>

      <main className="card">
        {currentStep <= totalSteps && (
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
