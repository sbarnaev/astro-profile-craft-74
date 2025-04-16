
import { 
  PersonalityCodeInterpretation, 
  ConnectorCodeInterpretation,
  RealizationCodeInterpretation,
  GeneratorCodeInterpretation,
  MissionCodeInterpretation
} from '@/types/codeInterpretations';

/**
 * Интерпретации кодов личности
 * Здесь хранятся все описания для каждого кода
 */

// Интерпретации кода личности для каждого числа
export const personalityCodeInterpretations: PersonalityCodeInterpretation[] = [
  {
    code: 1,
    archetype: "Лидер",
    meaning: "Индивидуальность, самостоятельность, лидерство",
    resourcefulManifestation: "Уверенность в себе, инициативность, способность вести за собой",
    distortedManifestation: "Эгоцентризм, авторитарность, неспособность принимать чужое мнение",
    developmentTask: "Научиться учитывать мнение других и делегировать",
    keyResourceQualities: [
      "Самостоятельность",
      "Независимость",
      "Решительность",
      "Целеустремленность"
    ],
    keyDistortions: [
      "Самоуверенность",
      "Неумение слушать",
      "Доминирование",
      "Нетерпимость"
    ],
    suitableProfessions: [
      "Руководитель",
      "Предприниматель",
      "Политик",
      "Директор"
    ]
  },
  // Сюда можно добавлять интерпретации для других кодов (2-9, 11)
];

// Интерпретации кода коннектора для каждого числа
export const connectorCodeInterpretations: ConnectorCodeInterpretation[] = [
  {
    code: 1,
    keyTask: "Проявлять индивидуальность и инициативу в контактах",
    whatWorks: "Прямой подход, ясное выражение мыслей, инициативность в общении",
    whatDoesntWork: "Навязывание своего мнения, директивность, неумение слушать других",
    contactWithWorldShouldBeBasedOn: "Уважении к себе и другим, ясном самовыражении без подавления"
  },
  // Сюда можно добавлять интерпретации для других кодов (2-9, 11)
];

// Интерпретации кода реализации для каждого числа
export const realizationCodeInterpretations: RealizationCodeInterpretation[] = [
  {
    code: 1,
    formula: "Через самостоятельность к самореализации",
    howPotentialIsRealized: "Через индивидуальные проекты, самостоятельные решения и лидерство",
    sourceOfIncomeAndSuccess: "Уникальные идеи, инновационный подход, способность быть первым",
    realizationType: "Индивидуальный путь",
    distortions: "Неспособность к сотрудничеству, игнорирование помощи других",
    recommendation: "Развивать умение делегировать и находить баланс между личными амбициями и коллективной работой"
  },
  // Сюда можно добавлять интерпретации для других кодов (2-9, 11)
];

// Интерпретации кода генератора для каждого числа
export const generatorCodeInterpretations: GeneratorCodeInterpretation[] = [
  {
    code: 1,
    formula: "Энергия лидерства и независимости",
    whatGivesEnergy: "Новые начинания, самостоятельные решения, признание индивидуальных достижений",
    whatTakesEnergy: "Рутина, подчинение, необходимость согласовывать каждое действие",
    signsPersonIsInFlow: [
      "Инициативность",
      "Энтузиазм в начинании новых проектов",
      "Чувство движения вперед",
      "Уверенность в своих силах"
    ],
    signsPersonIsBurnedOut: [
      "Раздражительность",
      "Категоричность",
      "Отказ от сотрудничества",
      "Чрезмерный контроль"
    ],
    recommendation: "Регулярно создавать условия для проявления инициативы и независимости, избегать длительного пребывания в подчиненной роли"
  },
  // Сюда можно добавлять интерпретации для других кодов (2-9, 11)
];

// Интерпретации кода миссии для каждого числа
export const missionCodeInterpretations: MissionCodeInterpretation[] = [
  {
    code: 1,
    essenceOfMission: "Развитие индивидуальности и лидерства для позитивных изменений",
    whatRealizesMission: "Создание нового, прокладывание пути, вдохновение других личным примером",
    missionTrial: "Преодоление эгоцентризма, интеграция индивидуального и коллективного",
    whatPreventsRealization: "Страх потери контроля, неверие в свои силы, чрезмерная зависимость от мнения окружающих",
    mainTransformation: "От эгоцентризма к осознанному лидерству на благо общества"
  },
  // Сюда можно добавлять интерпретации для других кодов (2-9, 11)
];

/**
 * Функция для получения интерпретации по коду
 * @param code - код (1-9, 11)
 * @param type - тип кода (личность, коннектор и т.д.)
 * @returns интерпретация соответствующего кода или undefined
 */
export function getCodeInterpretation(code: number | string, type: 'personality' | 'connector' | 'realization' | 'generator' | 'mission') {
  const codeNum = typeof code === 'string' ? parseInt(code, 10) : code;
  
  switch (type) {
    case 'personality':
      return personalityCodeInterpretations.find(item => item.code === codeNum);
    case 'connector':
      return connectorCodeInterpretations.find(item => item.code === codeNum);
    case 'realization':
      return realizationCodeInterpretations.find(item => item.code === codeNum);
    case 'generator':
      return generatorCodeInterpretations.find(item => item.code === codeNum);
    case 'mission':
      return missionCodeInterpretations.find(item => item.code === codeNum);
    default:
      return undefined;
  }
}
