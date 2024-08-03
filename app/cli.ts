import shumai from "shumai";
import type { LogLevel } from "@0xc/oauth-device-code-cli/src/logger";
import type { EnumKey } from "@0xc/oauth-device-code-cli/src/enum";

interface CliArgs {
	clientId: string;
	baseUrl: string;
	scopes: string;
	audience: string;
	copy: boolean;
	logLevel: EnumKey<typeof LogLevel>;
}

export function parseCliArgs(): CliArgs {
	const env = new shumai.String()
		.withName("env")
		.withIdentifier("env")
		.withShortIdentifier("e")
		.setRequired(true)
		.setDefault(Bun.env.ENV);

	const clientId = new shumai.String()
		.withName("clientId")
		.withIdentifier("client-id")
		.withShortIdentifier("i")
		.setRequired(true)
		.setDefault(Bun.env.OAUTH_CLIENT_ID);

	const baseUrl = new shumai.String()
		.withName("baseUrl")
		.withIdentifier("base-url")
		.withShortIdentifier("u")
		.setRequired(true)
		.setDefault(Bun.env.OAUTH_BASE_URL);

	const scopes = new shumai.String()
		.withName("scopes")
		.withIdentifier("scopes")
		.withShortIdentifier("s")
		.setRequired(true)
		.setDefault(Bun.env.OAUTH_SCOPES);

	const audience = new shumai.String()
		.withName("audience")
		.withIdentifier("audience")
		.withShortIdentifier("a")
		.setRequired(true)
		.setDefault(Bun.env.OAUTH_AUDIENCE);

	const logLevel = new shumai.String()
		.withName("logLevel")
		.withIdentifier("log-level")
		.withShortIdentifier("L")
		.setRequired(true)
		.setDefault(Bun.env.LOG_LEVEL ?? "Info");

	const copy = new shumai.Flag()
		.withName("copy")
		.withIdentifier("copy")
		.withShortIdentifier("c")
		.setDefault(false);

	const client = new shumai.Shumai([
		env,
		clientId,
		baseUrl,
		scopes,
		audience,
		logLevel,
		copy,
	]);

	client.parse();

	return client.values;
}
