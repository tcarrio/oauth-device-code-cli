import { EventEmitter } from "node:events";
import type { Server } from "bun";
import type { AuthorizationCodeListenerConfig } from "./authorization-code-listener-config";

export class AuthorizationCodeListener {
	private server: Server | null = null;
	private emitter = new EventEmitter();
	private readonly stateTracker: Record<string, Promise<string>> = {};

	constructor(private readonly config: AuthorizationCodeListenerConfig) {}

	register(state: string): Promise<string> {
		this.listen();

		return (this.stateTracker[state] ??= new Promise<string>((resolve) => {
			this.emitter.on(state, (code) => {
				delete this.stateTracker[state];

				resolve(code);

				if (Object.keys(this.stateTracker).length === 0) {
					this.stop();
				}
			});
		}));
	}

	private async listen(): Promise<void> {
		this.server ??= Bun.serve({
			hostname: this.config.host,
			port: this.config.port,
			fetch: async (request: Request): Promise<Response> => {
				const url = new URL(request.url);
				if (url.pathname !== this.config.path) {
					return new Response("Not found", {
						status: 404,
					});
				}

				const code = url.searchParams.get("code");
				const state = url.searchParams.get("state");

				if (!code || !state) {
					return new Response("Missing code or code_verifier", {
						status: 400,
					});
				}

				if (!(state in this.stateTracker)) {
					return new Response("Invalid state", {
						status: 409,
					});
				}

				this.emitter.emit(state, code);

				return new Response("Authorization received", {
					status: 200,
				});
			},
		});
	}

	async stop(): Promise<void> {
		if (this.server) {
			this.server.stop(true);
		}
	}
}