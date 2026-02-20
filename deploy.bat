@echo off
echo Building the project...
call npm run build

echo Navigating to dist folder...
cd dist

echo Initializing temporary git repo...
git init
git checkout -b gh-pages
git add -A
git commit -m "deploy"

echo Pushing to GitHub Pages...
git push -f https://github.com/lozendev/lozen-v2-final.git gh-pages

echo Deployment complete!
pause
