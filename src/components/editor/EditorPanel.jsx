import { useEffect } from 'react';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useAutoResize } from '../../hooks/useAutoResize';
import ModeBanner from './ModeBanner';
import ExtrasPicker from './ExtrasPicker';
import AiAnalysisCard from './AiAnalysisCard';
import ProjectInfo from './sections/ProjectInfo';
import ProblemGoal from './sections/ProblemGoal';
import PersonaSection from './sections/PersonaSection';
import BrandingSection from './sections/BrandingSection';
import CoverFooterSection from './sections/CoverFooterSection';
import RolesSection from './sections/RolesSection';
import FeaturesList from './sections/FeaturesList';
import AcSection from './sections/AcSection';
import TechStack from './sections/TechStack';
import SchemaSection from './sections/SchemaSection';
import NfrSection from './sections/NfrSection';
import OutOfScope from './sections/OutOfScope';

function AutoSaveBridge() {
  useAutoSave();
  return null;
}

export default function EditorPanel() {
  const ra = useAutoResize();

  useEffect(function () {
    function onInput(e) {
      if (e.target.tagName === 'TEXTAREA') ra.resize(e.target);
    }
    document.addEventListener('input', onInput);
    return function () { document.removeEventListener('input', onInput); };
  }, [ra.resize]);

  return (
    <section
      id="editorPanel"
      className="p-4 md:p-6 overflow-y-auto overflow-x-hidden no-print space-y-6 border-r border-slate-800 bg-slate-900"
      style={{ height: '100%' }}
    >
      <AutoSaveBridge />
      <ModeBanner />
      <ExtrasPicker />
      <AiAnalysisCard />
      <CoverFooterSection />
      <ProjectInfo />
      <ProblemGoal />
      <PersonaSection />
      <BrandingSection />
      <RolesSection />
      <FeaturesList />
      <AcSection />
      <TechStack />
      <SchemaSection />
      <NfrSection />
      <OutOfScope />
    </section>
  );
}