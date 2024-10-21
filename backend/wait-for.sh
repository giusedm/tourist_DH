#!/bin/sh

# wait-for.sh

set -e

host=$1
shift
cmd="$@"

echo "Inizio attesa per il servizio $host..."

while ! nc -z "$host" 5000 >/dev/null 2>&1; do
  echo "Attendo che il servizio $host sulla porta 5000 sia disponibile..."
  sleep 5
done

echo "Il servizio $host è ora operativo. Eseguo il comando: $cmd"
exec $cmd