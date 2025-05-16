import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { YapiMcpServer } from "./server";
import { getServerConfig } from "./config";

export async function startServer(): Promise<void> {
  const config = getServerConfig();
  const server = new YapiMcpServer(config.yapiBaseUrl, config.yapiToken);

  // 检查是否在stdio模式下运行（例如通过CLI）
  const isStdioMode = process.env.NODE_ENV === "cli" || process.argv.includes("--stdio");

  if (isStdioMode) {
    console.log("初始化Yapi MCP Server在stdio模式...");
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } else {
    console.log(`初始化Yapi MCP Server在HTTP模式上端口${config.port}...`);
    await server.startHttpServer(config.port);
  }

  console.log("\n可用工具:");
  console.log("- get_api_desc: 获取YApi接口信息");
}

// 如果直接运行此文件，则启动服务器
if (require.main === module) {
  startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}