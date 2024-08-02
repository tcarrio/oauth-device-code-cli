{
  description = "@0xc/oauth-device-code-cli";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system}; in
      {
        devShells = {
          default = pkgs.mkShell {
            packages = with pkgs; [
                git
                bun
            ];

            PROJECT_NAME = "@0xc/oauth-device-code-cli";

            shellHook = ''
                echo $ Started devshell for $PROJECT_NAME
                echo
            '';
          };
        };
      }
    );
}
