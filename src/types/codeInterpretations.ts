
/**
 * Типы для интерпретации кодов личности
 */

// Интерпретация кода личности
export interface PersonalityCodeInterpretation {
  code: number | string;
  archetype: string;
  meaning: string;
  resourcefulManifestation: string;
  distortedManifestation: string;
  developmentTask: string;
  keyResourceQualities: string[];
  keyDistortions: string[];
  suitableProfessions: string[];
}

// Интерпретация кода коннектора
export interface ConnectorCodeInterpretation {
  code: number | string;
  keyTask: string;
  whatWorks: string;
  whatDoesntWork: string;
  contactWithWorldShouldBeBasedOn: string;
}

// Интерпретация кода реализации
export interface RealizationCodeInterpretation {
  code: number | string;
  formula: string;
  howPotentialIsRealized: string;
  sourceOfIncomeAndSuccess: string;
  realizationType: string;
  distortions: string;
  recommendation: string;
}

// Интерпретация кода генератора
export interface GeneratorCodeInterpretation {
  code: number | string;
  formula: string;
  whatGivesEnergy: string;
  whatTakesEnergy: string;
  signsPersonIsInFlow: string[];
  signsPersonIsBurnedOut: string[];
  recommendation: string;
}

// Интерпретация кода миссии
export interface MissionCodeInterpretation {
  code: number | string;
  essenceOfMission: string;
  whatRealizesMission: string;
  missionTrial: string;
  whatPreventsRealization: string;
  mainTransformation: string;
}

// Полная интерпретация для конкретного кода
export interface CodeInterpretation {
  code: number | string;
  personality?: PersonalityCodeInterpretation;
  connector?: ConnectorCodeInterpretation;
  realization?: RealizationCodeInterpretation;
  generator?: GeneratorCodeInterpretation;
  mission?: MissionCodeInterpretation;
}
