{ pkgs }: {
	deps = [
   pkgs.bun
		pkgs.jq.bin
    pkgs.dotnet-sdk
    pkgs.omnisharp-roslyn
	];
}