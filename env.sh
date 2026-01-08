#!/bin/sh

# Caminho para o arquivo de configuração JS
config_file="/usr/share/nginx/html/env-config.js"

# Recriar o arquivo
echo "window.env = {" > "$config_file"

# Função para adicionar variável se existir
add_var() {
  var_name=$1
  var_value=$(printenv "$1")
  
  if [ ! -z "$var_value" ]; then
    echo "  $var_name: \"$var_value\"," >> "$config_file"
  fi
}

# Lista de variáveis permitidas (Whitelist)
add_var "VITE_GEMINI_API_KEY"
add_var "VITE_SUPABASE_URL"
add_var "VITE_SUPABASE_KEY"
add_var "VITE_APIFY_API_TOKEN"

echo "};" >> "$config_file"

echo "✅ Environment variables injected into $config_file"
