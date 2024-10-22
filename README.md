# @0xc/oauth-token-cli

Authentication CLI for OAuth/OIDC provider to authorize access to a resource.

## Getting started

To install dependencies:

```bash
bun install
```

To run:

```bash
bun oauth
```

## How to use

With `direnv` and a `.env` file, you can automatically import the variables defined in the CLI parser.

You can also define each variable explicitly at the command line. Environment variables are always backups to these values.

Required values that are not provided via either arguments or environment variables will result in a failure.

## More information

ℹ️ This project was created using `bun init` in bun v1.0.33. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
