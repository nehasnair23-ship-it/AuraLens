import AuraBuddy from './AuraBuddy';
import { AuraState } from '../types';

interface StudyCompanionDrawerProps {
  currentAuraState: AuraState;
  studyScore?: number;
}

export default function StudyCompanionDrawer({
  currentAuraState,
  studyScore = 20,
}: StudyCompanionDrawerProps) {
  return <AuraBuddy currentAuraState={currentAuraState} studyScore={studyScore} />;
}
