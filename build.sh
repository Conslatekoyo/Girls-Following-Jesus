#!/bin/sh
# Rebuilds the published pages from src/index.html:
#   index.html              – the website (GitHub Pages serves it from the repo root)
#   apps-script/Index.html  – the same page served by the Google Apps Script web app
set -e
cd "$(dirname "$0")"
SITE_URL="https://conslatekoyo.github.io/Girls-Following-Jesus/"
{
  cat <<HEAD
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Share what blessed you, what you're carrying home, and how we can grow. Girls Following Jesus programme evaluation.">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE_URL}">
<meta property="og:title" content="Girls Following Jesus · Programme Evaluation">
<meta property="og:description" content="Share what blessed you, what you're carrying home, and how we can grow.">
<meta property="og:image" content="${SITE_URL}og-image.png">
<meta name="theme-color" content="#c8497a">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23c8497a' d='M12 21s-7.5-4.6-10-9.3C.3 8.4 2.3 4.5 6 4.5c2.2 0 3.6 1.2 6 3.6 2.4-2.4 3.8-3.6 6-3.6 3.7 0 5.7 3.9 4 7.2C19.5 16.4 12 21 12 21z'/%3E%3C/svg%3E">
<style>[hidden]{display:none!important}</style>
</head>
<body>
HEAD
  sed 's/var MODE = "artifact";/var MODE = "web";/' src/index.html
  printf '\n</body>\n</html>\n'
} > index.html
grep -q 'var MODE = "web";' index.html
{ echo '<style>[hidden]{display:none!important}</style>'; cat src/index.html; } > apps-script/Index.html
echo "built index.html and apps-script/Index.html"
