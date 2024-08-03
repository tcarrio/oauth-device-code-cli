#!/usr/bin/env bun

import clipboard from "clipboardy";
import {
	OAuthAgent,
	OAuthClient,
	OAuthConfig,
} from "@0xc/oauth-device-code-cli/src/oauth";
import { ConsoleLogger, LogLevel } from "@0xc/oauth-device-code-cli/src/logger";
import { parseCliArgs } from "./cli";
import { KyHttpClient } from "@0xc/oauth-device-code-cli/src/http";

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
