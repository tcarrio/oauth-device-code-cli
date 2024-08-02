import { z } from "zod";

export class OAuthConfig {
  constructor(
    public readonly clientId: string,
    public readonly scopes: string,
    public readonly audience: string,
    public readonly baseUrl: string,
  ) {
    z.object({
      clientId: z.string().min(1),
      scopes: z.string().min(1),
      audience: z.string().url(),
      baseUrl: z.string().url(),
    }).parse(this);
  }

  static fromConfigLike(config: OAuthConfig): OAuthConfig {
    return new OAuthConfig(
      config.clientId,
      config.scopes,
      config.audience,
      config.baseUrl,
    );
  }
}
