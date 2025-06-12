#!/bin/sh

# Espera a que el puerto del host esté abierto
# $1 = host:port
# $2 = comando a ejecutar después

host_port=$1
shift
cmd="$@"

echo "Esperando a que $host_port esté disponible..."

while ! nc -z $(echo "$host_port" | cut -d: -f1) $(echo "$host_port" | cut -d: -f2); do
  sleep 1
done

echo "$host_port está disponible. Ejecutando comando: $cmd"
exec $cmd
