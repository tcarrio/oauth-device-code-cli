import { $ } from "bun";
import type { Logger } from "@0xc/oauth-device-code-cli/src/logger";

import type { AuthorizationCodePkceFlowOAuthClient } from "./authorization-code-pkce-client";
import type { AuthorizationCodeListener } from "./authorization-code-listener";
import type { TokenResponse } from "../common";

export class AuthorizationCodePkceFlowOAuthAgent {
	constructor(
		private readonly client: AuthorizationCodePkceFlowOAuthClient,
		private readonly listener: AuthorizationCodeListener,
		private readonly logger: Logger,
	) {}

	async authenticate(): Promise<TokenResponse> {
		const { state, codeChallenge, url } =
			await this.client.getAuthorizationUrl();

		const codePromise = this.listener.register(state);

		await this.promptAuthorizationFlow(url);

		const code = await codePromise;

		return this.client.retrieveToken({
			code,
			codeVerifier: codeChallenge,
		});
	}

	private async promptAuthorizationFlow(authorizationUrl: string) {
		this.logger.info(`Open "${authorizationUrl}" in your browser`);
		try {
			await $`open "${authorizationUrl}"`;
		} catch (error) {
			this.logger.info(`Open "${authorizationUrl}" in your browser`);
		}
	}
}
