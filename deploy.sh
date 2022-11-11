#!/usr/bin/env sh
# Run this to push the production build to the gh-pages branch.

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# place .nojekyll to bypass Jekyll processing
echo > .nojekyll

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -B master
git add -A
git commit -m 'deploy'

git push -f git@github.com:mattpk/fourier-transform.git master:gh-pages

cd -