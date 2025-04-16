
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  PersonalityCodeInterpretation,
  ConnectorCodeInterpretation,
  RealizationCodeInterpretation,
  GeneratorCodeInterpretation,
  MissionCodeInterpretation
} from "@/types/codeInterpretations";
import { getCodeInterpretation } from "@/data/codeInterpretations";

interface DetailsPanelProps {
  section: string;
  codes: {
    personalityCode: number | string;
    connectorCode: number | string;
    realizationCode: number | string;
    generatorCode: number | string;
    missionCode: number | string;
  };
}

export function DetailsPanel({ section, codes }: DetailsPanelProps) {
  const { personalityCode, connectorCode, realizationCode, generatorCode, missionCode } = codes;

  // Получение интерпретаций для каждого кода
  const personalityInterpretation = getCodeInterpretation(personalityCode, 'personality');
  const connectorInterpretation = getCodeInterpretation(connectorCode, 'connector');
  const realizationInterpretation = getCodeInterpretation(realizationCode, 'realization');
  const generatorInterpretation = getCodeInterpretation(generatorCode, 'generator');
  const missionInterpretation = getCodeInterpretation(missionCode, 'mission');

  const renderPersonalityDetails = () => {
    if (!personalityInterpretation) {
      return <p>Интерпретация для кода {personalityCode} не найдена</p>;
    }

    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Архетип</h4>
          <p className="text-muted-foreground mt-1">{personalityInterpretation.archetype}</p>
        </div>
        <div>
          <h4 className="font-medium">Смысл кода</h4>
          <p className="text-muted-foreground mt-1">{personalityInterpretation.meaning}</p>
        </div>
        <div>
          <h4 className="font-medium">Ресурсное проявление</h4>
          <p className="text-muted-foreground mt-1">{personalityInterpretation.resourcefulManifestation}</p>
        </div>
        <div>
          <h4 className="font-medium">Искаженное проявление</h4>
          <p className="text-muted-foreground mt-1">{personalityInterpretation.distortedManifestation}</p>
        </div>
        <div>
          <h4 className="font-medium">Задача развития</h4>
          <p className="text-muted-foreground mt-1">{personalityInterpretation.developmentTask}</p>
        </div>
        <div>
          <h4 className="font-medium">Ключевые качества в ресурсе</h4>
          <ul className="list-disc ml-5 mt-1">
            {personalityInterpretation.keyResourceQualities.map((quality, index) => (
              <li key={index} className="text-muted-foreground">{quality}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium">Ключевые искажения</h4>
          <ul className="list-disc ml-5 mt-1">
            {personalityInterpretation.keyDistortions.map((distortion, index) => (
              <li key={index} className="text-muted-foreground">{distortion}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium">Подходящие профессии</h4>
          <ul className="list-disc ml-5 mt-1">
            {personalityInterpretation.suitableProfessions.map((profession, index) => (
              <li key={index} className="text-muted-foreground">{profession}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderConnectorDetails = () => {
    if (!connectorInterpretation) {
      return <p>Интерпретация для кода {connectorCode} не найдена</p>;
    }

    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Ключевая задача во взаимодействии с миром</h4>
          <p className="text-muted-foreground mt-1">{connectorInterpretation.keyTask}</p>
        </div>
        <div>
          <h4 className="font-medium">Что работает (ресурсная форма проявления)</h4>
          <p className="text-muted-foreground mt-1">{connectorInterpretation.whatWorks}</p>
        </div>
        <div>
          <h4 className="font-medium">Что не работает (искажения во взаимодействии)</h4>
          <p className="text-muted-foreground mt-1">{connectorInterpretation.whatDoesntWork}</p>
        </div>
        <div>
          <h4 className="font-medium">Контакт с миром должен строиться на</h4>
          <p className="text-muted-foreground mt-1">{connectorInterpretation.contactWithWorldShouldBeBasedOn}</p>
        </div>
      </div>
    );
  };

  const renderRealizationDetails = () => {
    if (!realizationInterpretation) {
      return <p>Интерпретация для кода {realizationCode} не найдена</p>;
    }

    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Формула</h4>
          <p className="text-muted-foreground mt-1">{realizationInterpretation.formula}</p>
        </div>
        <div>
          <h4 className="font-medium">Как реализуется потенциал</h4>
          <p className="text-muted-foreground mt-1">{realizationInterpretation.howPotentialIsRealized}</p>
        </div>
        <div>
          <h4 className="font-medium">Где находится источник дохода и успеха</h4>
          <p className="text-muted-foreground mt-1">{realizationInterpretation.sourceOfIncomeAndSuccess}</p>
        </div>
        <div>
          <h4 className="font-medium">Тип реализации</h4>
          <p className="text-muted-foreground mt-1">{realizationInterpretation.realizationType}</p>
        </div>
        <div>
          <h4 className="font-medium">Искажения</h4>
          <p className="text-muted-foreground mt-1">{realizationInterpretation.distortions}</p>
        </div>
        <div>
          <h4 className="font-medium">Рекомендация</h4>
          <p className="text-muted-foreground mt-1">{realizationInterpretation.recommendation}</p>
        </div>
      </div>
    );
  };

  const renderGeneratorDetails = () => {
    if (!generatorInterpretation) {
      return <p>Интерпретация для кода {generatorCode} не найдена</p>;
    }

    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Формула</h4>
          <p className="text-muted-foreground mt-1">{generatorInterpretation.formula}</p>
        </div>
        <div>
          <h4 className="font-medium">Что дает энергию</h4>
          <p className="text-muted-foreground mt-1">{generatorInterpretation.whatGivesEnergy}</p>
        </div>
        <div>
          <h4 className="font-medium">Что забирает энергию</h4>
          <p className="text-muted-foreground mt-1">{generatorInterpretation.whatTakesEnergy}</p>
        </div>
        <div>
          <h4 className="font-medium">Признаки что человек в потоке</h4>
          <ul className="list-disc ml-5 mt-1">
            {generatorInterpretation.signsPersonIsInFlow.map((sign, index) => (
              <li key={index} className="text-muted-foreground">{sign}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium">Признаки что человек выгорел</h4>
          <ul className="list-disc ml-5 mt-1">
            {generatorInterpretation.signsPersonIsBurnedOut.map((sign, index) => (
              <li key={index} className="text-muted-foreground">{sign}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium">Рекомендация</h4>
          <p className="text-muted-foreground mt-1">{generatorInterpretation.recommendation}</p>
        </div>
      </div>
    );
  };

  const renderMissionDetails = () => {
    if (!missionInterpretation) {
      return <p>Интерпретация для кода {missionCode} не найдена</p>;
    }

    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Суть миссии</h4>
          <p className="text-muted-foreground mt-1">{missionInterpretation.essenceOfMission}</p>
        </div>
        <div>
          <h4 className="font-medium">Что реализует миссию</h4>
          <p className="text-muted-foreground mt-1">{missionInterpretation.whatRealizesMission}</p>
        </div>
        <div>
          <h4 className="font-medium">Испытание миссии</h4>
          <p className="text-muted-foreground mt-1">{missionInterpretation.missionTrial}</p>
        </div>
        <div>
          <h4 className="font-medium">Что мешает реализоваться</h4>
          <p className="text-muted-foreground mt-1">{missionInterpretation.whatPreventsRealization}</p>
        </div>
        <div>
          <h4 className="font-medium">Главная трансформация</h4>
          <p className="text-muted-foreground mt-1">{missionInterpretation.mainTransformation}</p>
        </div>
      </div>
    );
  };

  let content: ReactNode;

  switch (section) {
    case "personality":
      content = renderPersonalityDetails();
      break;
    case "connector":
      content = renderConnectorDetails();
      break;
    case "realization":
      content = renderRealizationDetails();
      break;
    case "generator":
      content = renderGeneratorDetails();
      break;
    case "mission":
      content = renderMissionDetails();
      break;
    default:
      content = <p>Выберите раздел для просмотра</p>;
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-2">Детальная интерпретация</h3>
          {content}
        </div>
      </CardContent>
    </Card>
  );
}
