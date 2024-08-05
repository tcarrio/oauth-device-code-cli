import type { AuthorizationCodePkceFlowOAuthConfig } from "./authorization-code-pkce-config";
import {
	ContentType,
	type HttpClient,
	type HttpRequestOptions,
} from "@0xc/oauth-device-code-cli/src/http";
import type { TokenResponse } from "../common";

const GrantType = {
	AuthorizationCode: "authorization_code",
} as const;

const FormBody = (options: Record<string, string>) =>
	new URLSearchParams(options).toString();

export class AuthorizationCodePkceFlowOAuthClient {
	private readonly CHALLENGE_METHOD = "S256";

	constructor(
		private readonly config: AuthorizationCodePkceFlowOAuthConfig,
		private readonly httpClient: HttpClient,
	) {}

	async getAuthorizationUrl(): Promise<AuthorizationInfo> {
		const url = new URL("/authorize", this.config.baseUrl);

		const codeChallenge = await this.generateCodeChallenge();
		const state = "TODO";

		url.searchParams.set("response_type", "code");
		url.searchParams.set("code_challenge", codeChallenge);
		url.searchParams.set("code_challenge_method", this.CHALLENGE_METHOD);
		url.searchParams.set("client_id", this.config.clientId);
		url.searchParams.set("redirect_uri", this.config.callbackUrl);
		url.searchParams.set("scope", this.config.scopes);
		url.searchParams.set("state", state);

		return {
			url: url.toString(),
			codeChallenge,
			state,
		};
	}

	async retrieveToken({
		code,
		codeVerifier,
	}: RetrieveTokenOptions): Promise<TokenResponse> {
		const url = `${this.config.baseUrl}/oauth/token`;

		const options: HttpRequestOptions = {
			headers: { "content-type": ContentType.Form },
			body: FormBody({
				grant_type: GrantType.AuthorizationCode,
				client_id: this.config.clientId,
				code,
				code_verifier: codeVerifier,
				redirect_uri: this.config.callbackUrl,
			}),
		};

		const response = await this.httpClient.post(url, options);

		return await response.json();
	}

	private async generateCodeChallenge(): Promise<string> {
		return "TODO";
	}
}

export interface AuthorizationInfo {
	url: string;
	codeChallenge: string;
	state: string;
}

export interface AuthorizationRedirectOptions {
	code: string;
	state: string;
}

export interface RetrieveTokenOptions {
	code: string;
	codeVerifier: string;
}
