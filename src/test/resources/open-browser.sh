#!/bin/bash
if [[ $# -eq 0 ]] ; then
    echo "Usage $0 <google-chrome|firefox|microsoft-edge>"
    exit 1
fi

BROWSER=$1
URLS=""

while read -r line; do
    URLS="${URLS} $line "
done < "websites.txt"

$BROWSER $URLS > /dev/null 2>&1 &
