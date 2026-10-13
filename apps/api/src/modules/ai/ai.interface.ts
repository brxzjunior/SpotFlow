import { AIParsedIntent } from '@spotflow/shared';

export interface IAIEngineProvider {
  name: string;
  parsePrompt(
    prompt: string,
    options?: {
      preferredEnergy?: 'low' | 'medium' | 'high' | 'any';
      approximateDurationMinutes?: number;
      allowExplicit?: boolean;
    }
  ): Promise<AIParsedIntent>;
}
