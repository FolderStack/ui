#!/bin/bash

current_script="$0"
script_directory="$(dirname "$current_script")"

host_arg="$1"

caddy reverse-proxy --from "$host_arg:443" --to :3000 --internal-certs
# npx local-ssl-proxy --hostname "$host_arg" --source 443 --target 3000 --cert "$script_directory/local.pem" --key "$script_directory/local-key.pem"