import type { Logger } from "../src/logger";
import type { TokenResponse } from "../src/oauth";
import type { CliArgs } from "./cli";

export interface Deps {
	logger: Logger;
}

export type OAuthFlowRunner = (
	deps: Deps,
	cliArgs: CliArgs,
) => Promise<TokenResponse>;
