import OpenAI from 'openai';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
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
 * ==================== 工具函数 ====================
 */

/**
 * 执行 bash 命令
 */
function executeBash(command: string): string {
  try {
    const output = execSync(command, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 10 });
    return output.trim();
  } catch (error: any) {
    return `命令执行失败: ${error.message}`;
  }
}

/**
 * 读取文件内容
 */
function readFile(filePath: string): string {
  try {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
      return `文件不存在: ${filePath}`;
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    const size = fs.statSync(fullPath).size;
    if (size > 100 * 1024) {
      return `文件过大 (${(size / 1024).toFixed(1)} KB > 100 KB)，只返回前 100KB:\n\n${content.slice(0, 100 * 1024)}`;
    }
    return content;
  } catch (error: any) {
    return `读取文件失败: ${error.message}`;
  }
}

/**
 * 写入文件
 */
function writeFile(filePath: string, content: string): string {
  try {
    const fullPath = path.resolve(filePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, content, 'utf8');
    return `文件写入成功: ${filePath} (${content.length} 字节)`;
  } catch (error: any) {
    return `写入文件失败: ${error.message}`;
  }
}

/**
 * 列出目录内容
 */
function listDir(dirPath: string = '.'): string {
  try {
    const fullPath = path.resolve(dirPath);
    if (!fs.existsSync(fullPath)) {
      return `目录不存在: ${dirPath}`;
    }
    const files = fs.readdirSync(fullPath);
    const result = files.map(file => {
      const stat = fs.statSync(path.join(fullPath, file));
      return `${stat.isDirectory() ? '📁' : '📄'} ${file}${stat.isDirectory() ? '/' : ''} (${(stat.size / 1024).toFixed(1)} KB)`;
    });
    return `当前目录 (${fullPath}):\n\n${result.join('\n')}`;
  } catch (error: any) {
    return `列出目录失败: ${error.message}`;
  }
}

/**
 * 搜索文本内容
 */
function grepSearch(pattern: string, path: string = '.'): string {
  try {
    const command = process.platform === 'darwin' || process.platform === 'linux'
      ? `grep -r -n "${pattern}" ${path} 2>/dev/null | head -50`
      : `findstr /s /n "${pattern}" ${path} | head -50`;
    return execSync(command, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 2 }).trim();
  } catch (error: any) {
    // grep returns non-zero exit code when no matches found
    if (error.message.includes('grep exited with status 1')) {
      return '未找到匹配内容';
    }
    return `搜索失败: ${error.message}`;
  }
}

/**
 * 查找文件
 */
function findFiles(pattern: string, dirPath: string = '.'): string {
  try {
    let output = '';
    function walk(dir: string): void {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          if (!file.startsWith('.git') && !file.startsWith('node_modules')) {
            walk(fullPath);
          }
        } else {
          if (file.toLowerCase().includes(pattern.toLowerCase())) {
            output += fullPath + '\n';
          }
        }
      }
    }
    walk(dirPath);
    return output.trim() || '未找到匹配文件';
  } catch (error: any) {
    return `查找文件失败: ${error.message}`;
  }
}

/**
 * 获取当前工作目录
 */
function pwd(): string {
  return `当前工作目录: ${process.cwd()}`;
}

/**
 * ==================== 工具解析与执行 ====================
 */

interface ToolCall {
  tool: string;
  args: string;
}

/**
 * 从 AI 响应中提取工具调用
 * 支持格式:
 * ```bash
 * command
 * ```
 *
 * ```read_file
 * path/to/file
 * ```
 *
 * ```write_file
 * path/to/file
 * content...
 * ```
 */
function extractToolCall(content: string): ToolCall | null {
  const codeBlockMatch = content.match(/```(\w+)\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    const tool = codeBlockMatch[1];
    const args = codeBlockMatch[2].trim();
    const supportedTools = ['bash', 'read_file', 'write_file', 'ls', 'grep', 'find', 'pwd'];
    if (supportedTools.includes(tool)) {
      return { tool, args };
    }
  }
  return null;
}

/**
 * 执行工具调用
 */
function executeTool(toolCall: ToolCall): string {
  const { tool, args } = toolCall;
  switch (tool) {
    case 'bash':
      return executeBash(args);
    case 'read_file':
      return readFile(args);
    case 'write_file': {
      // 格式: path\ncontent
      const newlineIndex = args.indexOf('\n');
      if (newlineIndex === -1) {
        return 'write_file 格式错误: 需要路径和内容用换行分隔';
      }
      const filePath = args.slice(0, newlineIndex).trim();
      const content = args.slice(newlineIndex + 1);
      return writeFile(filePath, content);
    }
    case 'ls':
      return listDir(args || '.');
    case 'grep': {
      const parts = args.split(/\s+/, 2);
      return grepSearch(parts[0], parts[1] || '.');
    }
    case 'find': {
      const parts = args.split(/\s+/, 2);
      return findFiles(parts[0], parts[1] || '.');
    }
    case 'pwd':
      return pwd();
    default:
      return `不支持的工具: ${tool}`;
  }
}

/**
 * ==================== 主交互逻辑 ====================
 */

/**
 * 交互式聊天，支持多种工具
 */
async function interactiveChat(config: OpenAIClientConfig) {
  const client = createOpenAIClient(config);
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `你是 mini Claude - 一个运行在终端中的 AI 编程助手，类似 Claude Code。

你可以使用以下工具来帮助用户完成任务。当你需要获取信息、操作文件、执行命令时，请使用工具。

工具使用格式：将你的工具调用放在代码块中，工具名作为语言标识：

\`\`\`bash
ls -la
\`\`\`

可用工具:

- bash: 执行任意 bash 命令
  例子:
  \`\`\`bash
  git status
  \`\`\`

- read_file: 读取文件内容
  例子:
  \`\`\`read_file
  src/index.ts
  \`\`\`

- write_file: 写入文件内容 (路径和内容用换行分隔
  例子:
  \`\`\`write_file
  hello.txt
  Hello world!
  This is the content.
  \`\`\`

- ls: 列出目录内容
  例子:
  \`\`\`ls
  ./src
  \`\`\`

- grep: 搜索文本内容
  例子:
  \`\`\`grep
  function find .
  \`\`\`

- find: 按文件名查找文件
  例子:
  \`\`\`find
  tsconfig .
  \`\`\`

- pwd: 显示当前工作目录
  例子:
  \`\`\`pwd
  \`\`\`

工作流程：
1. 用户提出问题
2. 你分析问题，决定使用哪些工具
3. 你输出工具调用
4. 系统执行工具并返回结果
5. 你根据工具结果继续回答或继续调用工具
6. 任务完成后给用户最终回答

请保持专业、简洁、准确。`,
    },
  ];

  const welcome = `
🤖 mini Claude - 终端 AI 编程助手已启动
📦 可用工具: bash, read_file, write_file, ls, grep, find, pwd
⌨️  输入 "exit" 或 "quit" 退出
`;
  console.log(welcome + '\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = (): Promise<string> => {
    return new Promise((resolve) => {
      rl.question('你 > ', resolve);
    });
  };

  while (true) {
    const userInput = await askQuestion();

    if (userInput.trim().toLowerCase() === 'exit' || userInput.trim().toLowerCase() === 'quit') {
      console.log('👋 再见！');
      rl.close();
      break;
    }

    if (!userInput.trim()) continue;

    messages.push({ role: 'user', content: userInput });
    await processChatRound(client, config.model, messages);
  }
}

/**
 * 处理一轮对话，可能包含多次工具调用
 */
async function processChatRound(
  client: OpenAI,
  model: string,
  messages: OpenAI.ChatCompletionMessageParam[]
) {
  let hasPendingToolCall = true;
  let firstRound = true;

  while (hasPendingToolCall) {
    process.stdout.write(firstRound ? 'AI > ' : '');
    firstRound = false;
    let fullResponse = '';

    try {
      const stream = await chatCompletion(client, model, messages);

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          fullResponse += content;
          process.stdout.write(content);
        }
      }

      messages.push({ role: 'assistant', content: fullResponse });
      console.log('\n');

      const toolCall = extractToolCall(fullResponse);
      if (toolCall) {
        console.log(`⚙️ 执行工具: ${toolCall.tool}`);
        const result = executeTool(toolCall);
        console.log(`\n📄 结果:\n${result}\n`);
        messages.push({
          role: 'user',
          content: `工具 [${toolCall.tool}] 执行结果:\n\`\`\`\n${result}\n\`\`\n`,
        });
        hasPendingToolCall = true;
      } else {
        hasPendingToolCall = false;
      }

    } catch (error) {
      console.error('\n❌ 错误:', error);
      console.log();
      hasPendingToolCall = false;
    }
  }
}

// 主程序
const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

if (!apiKey || apiKey === 'your-api-key-here') {
  console.error('❌ 请先在 .env 文件中设置 OPENAI_API_KEY');
  process.exit(1);
}

const config: OpenAIClientConfig = {
  apiKey,
  baseURL,
  model,
};

console.log(`🔧 配置加载成功`);
console.log(`   Model: ${config.model}`);
console.log(`   BaseURL: ${config.baseURL}\n`);

interactiveChat(config).catch(console.error);
