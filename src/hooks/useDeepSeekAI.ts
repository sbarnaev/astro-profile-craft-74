
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

// Типы для работы с API
interface DeepSeekAIRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

interface DeepSeekAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Хук для работы с DeepSeek API
export function useDeepSeekAI(apiKey: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Функция для генерации анализа персональности на основе данных клиента
  const generatePersonalityAnalysis = async (
    clientData: {
      firstName: string;
      lastName: string;
      personality_code?: number | string;
      connector_code?: number | string;
      realization_code?: number | string;
      generator_code?: number | string;
      mission_code?: number | string;
    },
    analysisType: 'full' | 'brief' | 'relationship' = 'full'
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Создаем системное сообщение с инструкциями
      const systemMessage = `Ты опытный психолог-консультант, специализирующийся на анализе личности. 
      Проанализируй личность клиента на основе предоставленных кодов и создай ${
        analysisType === 'full' ? 'подробный' : analysisType === 'brief' ? 'краткий' : 'анализ совместимости'
      } психологический портрет.`;

      // Создаем сообщение пользователя с данными
      let userMessage = `Имя клиента: ${clientData.firstName} ${clientData.lastName}\n`;
      
      if (clientData.personality_code) {
        userMessage += `Код личности: ${clientData.personality_code}\n`;
      }
      
      if (clientData.connector_code) {
        userMessage += `Код коннектора: ${clientData.connector_code}\n`;
      }
      
      if (clientData.realization_code) {
        userMessage += `Код реализации: ${clientData.realization_code}\n`;
      }
      
      if (clientData.generator_code) {
        userMessage += `Код генератора: ${clientData.generator_code}\n`;
      }
      
      if (clientData.mission_code) {
        userMessage += `Код миссии: ${clientData.mission_code}\n`;
      }

      userMessage += `\nПожалуйста, составь ${
        analysisType === 'full' 
          ? 'подробный психологический портрет, анализ сильных и слабых сторон, рекомендации по развитию' 
          : analysisType === 'brief'
          ? 'краткий психологический портрет с основными характеристиками'
          : 'анализ совместимости с учетом психологических особенностей'
      }.`;

      // Подготавливаем данные для запроса
      const data: DeepSeekAIRequest = {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: analysisType === 'brief' ? 1024 : 2048
      };

      // Отправляем запрос к API
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Ошибка запроса к DeepSeek API");
      }

      const result: DeepSeekAIResponse = await response.json();
      const analysisText = result.choices[0]?.message.content || "Анализ не удалось сгенерировать";

      return analysisText;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Неизвестная ошибка";
      setError(errorMessage);
      toast({
        title: "Ошибка AI анализа",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Функция для анализа совместимости двух клиентов
  const generateCompatibilityAnalysis = async (
    client1: {
      firstName: string;
      lastName: string;
      personality_code?: number | string;
      connector_code?: number | string;
    },
    client2: {
      firstName: string;
      lastName: string;
      personality_code?: number | string;
      connector_code?: number | string;
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Создаем системное сообщение с инструкциями
      const systemMessage = `Ты опытный психолог-консультант, специализирующийся на анализе совместимости людей. 
      Проанализируй совместимость двух клиентов на основе предоставленных кодов и создай подробный анализ их взаимодействия.`;

      // Создаем сообщение пользователя с данными
      let userMessage = `Клиент 1: ${client1.firstName} ${client1.lastName}\n`;
      
      if (client1.personality_code) {
        userMessage += `Код личности: ${client1.personality_code}\n`;
      }
      
      if (client1.connector_code) {
        userMessage += `Код коннектора: ${client1.connector_code}\n`;
      }
      
      userMessage += `\nКлиент 2: ${client2.firstName} ${client2.lastName}\n`;
      
      if (client2.personality_code) {
        userMessage += `Код личности: ${client2.personality_code}\n`;
      }
      
      if (client2.connector_code) {
        userMessage += `Код коннектора: ${client2.connector_code}\n`;
      }

      userMessage += `\nПожалуйста, составь подробный анализ совместимости этих людей, их сильные и слабые стороны во взаимодействии, потенциальные конфликты и рекомендации по улучшению отношений.`;

      // Подготавливаем данные для запроса
      const data: DeepSeekAIRequest = {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 2048
      };

      // Отправляем запрос к API
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Ошибка запроса к DeepSeek API");
      }

      const result: DeepSeekAIResponse = await response.json();
      const analysisText = result.choices[0]?.message.content || "Анализ совместимости не удалось сгенерировать";

      return analysisText;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Неизвестная ошибка";
      setError(errorMessage);
      toast({
        title: "Ошибка AI анализа совместимости",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generatePersonalityAnalysis,
    generateCompatibilityAnalysis
  };
}
