import { OpenAI } from 'openai';
import { env } from '~/config/env.server';
import type { Command } from './command-processor.server';

interface CommandFeedback {
  command: Command;
  explanation: string;
  impact: {
    scope: string[];
    risk: 'low' | 'medium' | 'high';
    estimatedTime: number;
  };
  requiresConfirmation: boolean;
  confirmationMessage: string;
  alternatives?: string[];
}

interface CommandResult {
  success: boolean;
  message: string;
  details?: Record<string, unknown>;
  nextSteps?: string[];
  rollbackInstructions?: string;
}

export class FeedbackService {
  private static instance: FeedbackService;
  private openai: OpenAI;

  private constructor() {
    this.openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  static getInstance(): FeedbackService {
    if (!FeedbackService.instance) {
      FeedbackService.instance = new FeedbackService();
    }
    return FeedbackService.instance;
  }

  async generateCommandFeedback(command: Command): Promise<CommandFeedback> {
    const prompt = `Analyze the following command and provide detailed feedback:
    Command: ${JSON.stringify(command)}
    
    Consider:
    1. What the command will do
    2. Which parts of the store will be affected
    3. Potential risks
    4. Estimated execution time
    5. Whether confirmation is needed
    6. Alternative approaches if applicable
    
    Format the response as a JSON object.`;

    const completion = await this.openai.chat.completions.create({
      model: command.tier >= 3 ? 'gpt-4' : 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('Failed to generate command feedback');
    }

    try {
      return JSON.parse(response);
    } catch (error) {
      throw new Error(`Invalid feedback structure: ${error.message}`);
    }
  }

  async generateCommandResult(
    command: Command,
    success: boolean,
    details?: Record<string, unknown>
  ): Promise<CommandResult> {
    const prompt = `Generate a result message for the following command execution:
    Command: ${JSON.stringify(command)}
    Success: ${success}
    Details: ${JSON.stringify(details || {})}
    
    Consider:
    1. Clear explanation of what happened
    2. Next steps if applicable
    3. Rollback instructions if needed
    4. Any warnings or important notes
    
    Format the response as a JSON object.`;

    const completion = await this.openai.chat.completions.create({
      model: command.tier >= 3 ? 'gpt-4' : 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('Failed to generate command result');
    }

    try {
      return JSON.parse(response);
    } catch (error) {
      throw new Error(`Invalid result structure: ${error.message}`);
    }
  }

  async generateRollbackPlan(command: Command): Promise<{
    steps: string[];
    estimatedTime: number;
    risk: 'low' | 'medium' | 'high';
  }> {
    const prompt = `Generate a rollback plan for the following command:
    Command: ${JSON.stringify(command)}
    
    Consider:
    1. Steps needed to undo the changes
    2. Estimated time to complete rollback
    3. Risk level of the rollback process
    4. Any potential data loss
    
    Format the response as a JSON object.`;

    const completion = await this.openai.chat.completions.create({
      model: command.tier >= 3 ? 'gpt-4' : 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('Failed to generate rollback plan');
    }

    try {
      return JSON.parse(response);
    } catch (error) {
      throw new Error(`Invalid rollback plan structure: ${error.message}`);
    }
  }

  async generateAlternativeCommands(command: Command): Promise<string[]> {
    const prompt = `Generate alternative approaches for the following command:
    Command: ${JSON.stringify(command)}
    
    Consider:
    1. Safer alternatives
    2. More efficient approaches
    3. Step-by-step alternatives
    4. Less risky options
    
    Format the response as a JSON array of command strings.`;

    const completion = await this.openai.chat.completions.create({
      model: command.tier >= 3 ? 'gpt-4' : 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('Failed to generate alternative commands');
    }

    try {
      return JSON.parse(response);
    } catch (error) {
      throw new Error(`Invalid alternatives structure: ${error.message}`);
    }
  }
} 