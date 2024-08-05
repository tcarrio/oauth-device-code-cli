export interface Base64Encoder {
  encode(input: string): string;
}

export interface Base64Decoder {
  decode(input: string): string;
}

export interface Base64Transformer {
  toUrlSafe(input: string): string;
}

export class WebBase64Format
  implements Base64Encoder, Base64Decoder, Base64Transformer
{
  constructor(private readonly urlSafe: boolean) {}

  public encode(input: string): string {
    const encoded = btoa(input);

    if (!this.urlSafe) {
      return encoded;
    }

    return this.toUrlSafe(encoded);
  }

  public decode(input: string): string {
    return atob(input);
  }

  public toUrlSafe(encoded: string): string {
    return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
}
