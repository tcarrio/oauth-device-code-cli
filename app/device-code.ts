import type { CliArgs } from "./cli";
import { KyHttpClient } from "@0xc/oauth-device-code-cli/src/http";
import {
  DeviceCodeFlowOAuthConfig,
  DeviceCodeFlowOAuthClient,
  DeviceCodeFlowOAuthAgent,
} from "../src/oauth/device-code";
import type { TokenResponse } from "../src/oauth";
import type { RunnerDeps } from "./types";

export async function runDeviceCodeFlow(
  { logger }: RunnerDeps,
  { logLevel, ...config }: CliArgs,
): Promise<TokenResponse> {
  const oauthConfig = DeviceCodeFlowOAuthConfig.fromConfigLike(config);
  const httpClient = new KyHttpClient();
  const client = new DeviceCodeFlowOAuthClient(oauthConfig, httpClient);
  const agent = new DeviceCodeFlowOAuthAgent(client, logger);

  return await agent.authenticate();
}
