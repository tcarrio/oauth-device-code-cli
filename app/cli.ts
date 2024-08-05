import shumai from "shumai";
import type { LogLevel } from "@0xc/oauth-device-code-cli/src/logger";
import type { EnumKey } from "@0xc/oauth-device-code-cli/src/enum";

export interface CliArgs {
  clientId: string;
  baseUrl: string;
  scopes: string;
  audience: string;
  flow: string;
  copy: boolean;
  logLevel: EnumKey<typeof LogLevel>;
  callbackUrl?: string;
}

export function parseCliArgs(): CliArgs {
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

  const callbackUrl = new shumai.String()
    .withName("callbackUrl")
    .withIdentifier("callback-url")
    .withShortIdentifier("c")
    .setRequired(true)
    .setDefault(Bun.env.OAUTH_CALLBACK_URL);

  const flow = new shumai.String()
    .withName("flow")
    .withIdentifier("flow")
    .withShortIdentifier("f")
    .setRequired(true)
    .setDefault(Bun.env.OAUTH_FLOW ?? "device-code");

  const logLevel = new shumai.String()
    .withName("logLevel")
    .withIdentifier("log-level")
    .withShortIdentifier("L")
    .setRequired(true)
    .setDefault(Bun.env.LOG_LEVEL ?? "Info");

  const copy = new shumai.Flag()
    .withName("copy")
    .withIdentifier("copy")
    .withShortIdentifier("C")
    .setDefault(false);

  const client = new shumai.Shumai([
    clientId,
    baseUrl,
    scopes,
    audience,
    callbackUrl,
    flow,
    logLevel,
    copy,
  ]);

  client.parse();

  return client.values;
}
