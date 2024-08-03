import { time } from "@0xc/oauth-device-code-cli/src/time";
import type { OAuthConfig } from "./config";
import type {
	HttpClient,
	HttpRequestOptions,
} from "@0xc/oauth-device-code-cli/src/http";

const ContentType = {
	Form: "application/x-www-form-urlencoded",
} as const;

const GrantType = {
	DeviceCode: "urn:ietf:params:oauth:grant-type:device_code",
} as const;

const FormBody = URLSearchParams;

export class OAuthClient {
	constructor(
		private readonly config: OAuthConfig,
		private readonly httpClient: HttpClient,
	) {}

	async getDeviceCode(): Promise<DeviceCodeResponse> {
		const url = `${this.config.baseUrl}/oauth/device/code`;
		const options: HttpRequestOptions = {
			headers: { "content-type": "application/x-www-form-urlencoded" },
			body: new FormBody({
				client_id: this.config.clientId,
				scope: this.config.scopes,
				audience: this.config.audience,
			}).toString(),
		};

		const response = await this.httpClient.post(url, options);

		return await response.json();
	}

	async retrieveToken({
		device_code,
		interval,
	}: DeviceCodeResponse): Promise<TokenResponse> {
		const url = `${this.config.baseUrl}/oauth/token`;
		const options: HttpRequestOptions = {
			headers: { "content-type": ContentType.Form },
			body: new FormBody({
				grant_type: GrantType.DeviceCode,
				device_code: device_code,
				client_id: this.config.clientId,
			}).toString(),
			timeout: interval * time.Second,
		};

		const response = await this.httpClient.post(url, options);

		return await response.json();
	}
}

export interface DeviceCodeResponse {
	device_code: string;
	user_code: string;
	verification_uri: string;
	verification_uri_complete: `${string}?user_code=${DeviceCodeResponse["user_code"]}`;
	/**
	 * The number of seconds in which the device code and user code will expire.
	 */
	expires_in: number;
	/**
	 * The interval at which to poll for successful authorization measured in seconds
	 */
	interval: number;
}

export interface TokenResponse {
	/** JWT when using OIDC */
	access_token: string;
	/** Defined when scope `offline_access` included */
	refresh_token?: string;
	/** JWT when using OIDC */
	id_token?: string;
	/** The scopes provided to initial OAuth flow */
	scope: string;
	/** measured in seconds */
	expires_in: number;
	token_type: "Bearer" | string;
}
