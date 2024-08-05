import { ConsoleLogger, LogLevel } from "@0xc/oauth-device-code-cli/src/logger";
import type { CliArgs } from "./cli";
import { KyHttpClient } from "@0xc/oauth-device-code-cli/src/http";
import {
	AuthorizationCodePkceFlowOAuthConfig,
	AuthorizationCodePkceFlowOAuthClient,
	AuthorizationCodePkceFlowOAuthAgent,
	AuthorizationCodeListenerConfig,
	AuthorizationCodeListener,
} from "../src/oauth/authorization-code";
import type { TokenResponse } from "../src/oauth";
import type { Deps } from "./types";

export async function runAuthorizationCodeFlow(
	{ logger }: Deps,
	{ logLevel, ...config }: CliArgs,
): Promise<TokenResponse> {
	const oauthConfig = AuthorizationCodePkceFlowOAuthConfig.fromConfigLike(
		config as any,
	);
	const listenerConfig = AuthorizationCodeListenerConfig.fromCallbackUrl(
		oauthConfig.callbackUrl,
	);
	const listener = new AuthorizationCodeListener(listenerConfig);
	const httpClient = new KyHttpClient();
	const client = new AuthorizationCodePkceFlowOAuthClient(
		oauthConfig,
		httpClient,
	);
	const agent = new AuthorizationCodePkceFlowOAuthAgent(
		client,
		listener,
		logger,
	);

	return await agent.authenticate();
}
