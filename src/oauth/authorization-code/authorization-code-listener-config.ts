import { z } from "zod";

export class AuthorizationCodeListenerConfig
	implements z.infer<(typeof AuthorizationCodeListenerConfig)["SCHEMA"]>
{
	public static readonly SCHEMA = z.object({
		port: z.number().int().positive().lte(65535),
		host: z.string().default("localhost"),
		path: z.string().default("/oauth/callback"),
	});

	constructor(
		public readonly port: number,
		public readonly host: string,
		public readonly path: string,
	) {}

	static fromConfigLike(
		config: AuthorizationCodeListenerConfig,
	): AuthorizationCodeListenerConfig {
		return new AuthorizationCodeListenerConfig(
			config.port,
			config.host,
			config.path,
		);
	}

	static fromCallbackUrl(callbackUrl: string): AuthorizationCodeListenerConfig {
		const url = new URL(callbackUrl);
		return new AuthorizationCodeListenerConfig(
			Number.parseInt(url.port, 10),
			url.hostname,
			url.pathname,
		);
	}
}
