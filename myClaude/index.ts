import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * OpenAI 格式 API 客户端配置
 * 支持兼容 OpenAI 格式的 API 服务（如 Claude、Gemini、本地模型等）
 */
export interface OpenAIClientConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  timeout?: number;
}

/**
 * 创建兼容 OpenAI 格式的 API 客户端
 */
export function createOpenAIClient(config: OpenAIClientConfig): OpenAI {
  return new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
    timeout: config.timeout ?? 30000,
    dangerouslyAllowBrowser: true,
  });
}

/**
 * 聊天补全请求
 */
export async function chatCompletion(
  client: OpenAI,
  model: string,
  messages: OpenAI.ChatCompletionMessageParam[],
  options: Partial<OpenAI.ChatCompletionCreateParamsStreaming> = {}
) {
  return client.chat.completions.create({
    model,
    messages,
    stream: true,
    temperature: 0.7,
    ...options,
  });
}

/**
 * 简单的文本对话示例
 */
export async function simpleChat(
  config: OpenAIClientConfig,
  userMessage: string,
  systemPrompt?: string
) {
  const client = createOpenAIClient(config);
  const messages: OpenAI.ChatCompletionMessageParam[] = [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
    chatHistory.push({ role: 'system', content: systemPrompt });
  }

  messages.push({ role: 'user', content: userMessage });
  chatHistory.push({ role: 'user', content: userMessage });

  const stream = await chatCompletion(client, config.model, messages);
  let fullResponse = '';

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      fullResponse += content;
      process.stdout.write(content);
    }
  }

  return fullResponse;
}

// 示例使用
const config: OpenAIClientConfig = {
  apiKey: process.env.OPENAI_API_KEY ,
  baseURL: process.env.OPENAI_BASE_URL,
  model: process.env.OPENAI_MODEL,
};

const chatHistory = [];

simpleChat(config, '你好！请介绍一下你自己。')
  .then(() => process.exit(0))
  .catch(console.error);