#!/usr/bin/env bun

import clipboard from "clipboardy";
import { OAuthAgent, OAuthClient, OAuthConfig } from "$lib/oauth";
import { ConsoleLogger, LogLevel } from "$lib/logger";
import { parseCliArgs } from "./cli";
import { KyHttpClient } from "$lib/http";

const { copy, logLevel, ...config } = parseCliArgs();

const oauthConfig = OAuthConfig.fromConfigLike(config);
const logger = new ConsoleLogger(LogLevel[logLevel]);
const httpClient = new KyHttpClient();
const client = new OAuthClient(oauthConfig, httpClient);
const agent = new OAuthAgent(client, logger);

const code = await agent.authenticateWithDeviceCodeFlow();

if (copy) {
  await clipboard.write(code.access_token);

  logger.info("Access token copied to clipboard");
} else {
  logger.info(code);
}
