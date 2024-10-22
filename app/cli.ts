import shumai from "shumai";
import { LogLevel, type LogLevelType } from "@0xc/oauth-device-code-cli/src/logger";
import type { EnumKey } from "@0xc/oauth-device-code-cli/src/enum";
import { ConfigResult } from "./config";
import { parseArgs } from "node:util";
import { booleanFlag, stringFlag } from "./flags";
import { z, ZodEnum } from "zod";

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

async function parseCliArgsWithShumai(): Promise<CliArgs> {
  const { oauth, logLevel, output } = (await ConfigResult.loadDefault()).value;

  const clientIdArgument = new shumai.String()
    .withName("clientId")
    .withIdentifier("client-id")
    .withShortIdentifier("i")
    .setDefault(Bun.env.OAUTH_CLIENT_ID ?? oauth?.clientId);

  const baseUrlArgument = new shumai.String()
    .withName("baseUrl")
    .withIdentifier("base-url")
    .withShortIdentifier("u")
    .setDefault(Bun.env.OAUTH_BASE_URL ?? oauth?.baseUrl);

  const scopesArgument = new shumai.String()
    .withName("scopes")
    .withIdentifier("scopes")
    .withShortIdentifier("s")
    .setDefault(Bun.env.OAUTH_SCOPES ?? oauth?.scopes);

  const audienceArgument = new shumai.String()
    .withName("audience")
    .withIdentifier("audience")
    .withShortIdentifier("a")
    .setDefault(Bun.env.OAUTH_AUDIENCE ?? oauth?.audience);

  const callbackUrlArgument = new shumai.String()
    .withName("callbackUrl")
    .withIdentifier("callback-url")
    .withShortIdentifier("c")
    .setDefault(Bun.env.OAUTH_CALLBACK_URL ?? oauth?.callbackUrl);

  const flowArgument = new shumai.String()
    .withName("flow")
    .withIdentifier("flow")
    .withShortIdentifier("f")
    .setDefault(Bun.env.OAUTH_FLOW ?? oauth?.flow ?? "device-code");

  const logLevelArgument = new shumai.String()
    .withName("logLevel")
    .withIdentifier("log-level")
    .withShortIdentifier("L")
    .setDefault(Bun.env.LOG_LEVEL ?? logLevel ?? "Info");

  const copyArgument = new shumai.Flag()
    .withName("copy")
    .withIdentifier("copy")
    .withShortIdentifier("C")
    .setDefault((Bun.env.OUTPUT_TARGET ?? output?.target) === "clipboard");

  const client = new shumai.Shumai([
    clientIdArgument,
    baseUrlArgument,
    scopesArgument,
    audienceArgument,
    callbackUrlArgument,
    flowArgument,
    logLevelArgument,
    copyArgument,
  ]);

  client.parse();

  return client.values;
}

type NonEmptyArray<T> = [T, ...T[]];

const CliArgsSchema = z.object({
  clientId: z.string(),
  baseUrl: z.string(),
  scopes: z.string(),
  audience: z.string(),
  flow: z.string(),
  copy: z.boolean(),
  logLevel: z.enum(Object.keys(LogLevel) as NonEmptyArray<EnumKey<LogLevelType>>),
  callbackUrl: z.string().optional(),
});

async function parseCliArgsWithNodeUtil(): Promise<CliArgs> {
  const { oauth = {}, logLevel, output } = (await ConfigResult.loadDefault()).value;

  const { values } = parseArgs({
    options: {
      "client-id": stringFlag("i", Bun.env.OAUTH_CLIENT_ID ?? oauth.clientId),
      "base-url": stringFlag("u", Bun.env.OAUTH_BASE_URL ?? oauth?.baseUrl),
      "scopes": stringFlag("s", Bun.env.OAUTH_SCOPES ?? oauth?.scopes),
      "audience": stringFlag("a", Bun.env.OAUTH_AUDIENCE ?? oauth?.audience),
      "callback-url": stringFlag("c", Bun.env.OAUTH_CALLBACK_URL ?? oauth?.callbackUrl),
      "flow": stringFlag("f", Bun.env.OAUTH_FLOW ?? oauth?.flow ?? "device-code"),
      "log-level": stringFlag("L", Bun.env.LOG_LEVEL ?? logLevel ?? "Info"),
      "copy": booleanFlag("C", (Bun.env.OUTPUT_TARGET ?? output?.target) === "clipboard"),
    },
    args: Bun.argv,
    strict: true,
    allowPositionals: true,
    allowNegative: true,
  });


  return CliArgsSchema.parse({
    clientId: values["client-id"],
    baseUrl: values["base-url"],
    scopes: values["scopes"],
    audience: values["audience"],
    callbackUrl: values["callback-url"],
    flow: values["flow"],
    logLevel: values["log-level"],
    copy: values["copy"],
  });
}

export const parseCliArgs = parseCliArgsWithNodeUtil;