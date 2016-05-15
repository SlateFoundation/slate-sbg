#!/bin/bash

# configuration
PACKAGE_PATH="sencha-workspace/packages/slate-sbg"
SOURCE_BRANCH="master"
BUILD_BRANCH="builds/v1"


# environmental requirements
test "$(git symbolic-ref --short -q HEAD)" = "$SOURCE_BRANCH" || { echo >&2 "Current branch must be $SOURCE_BRANCH"; exit 1; }
test -z "$(git status --porcelain)" || { echo >&2 "Working tree must be clean"; exit 1; }
command -v underscore >/dev/null 2>&1 || { echo >&2 "Please run: npm install -g underscore-cli"; exit 1; }


# test SLATE_ADMIN environmental variable
test -n "$SLATE_ADMIN" || { echo >&2 "Need to set SLATE_ADMIN path to slate-admin repository"; exit 1; }
LIB_PATH=`cd $SLATE_ADMIN/sencha-workspace/packages; pwd`
test -d "$LIB_PATH/slate-sbg" || { echo >&2 "slate-sbg not found in $LIB_PATH"; exit 1; }


# check version change
JSON_PATH="$PACKAGE_PATH/package.json"
test -f "$JSON_PATH" || { echo >&2 "Could not find $JSON_PATH"; exit 1; }

VERSION_LAST=`git show $BUILD_BRANCH:$JSON_PATH | underscore extract version --outfmt text`
VERSION_NEXT=`git show $SOURCE_BRANCH:$JSON_PATH | underscore extract version --outfmt text`

echo "Package version in $BUILD_BRANCH: $VERSION_LAST"
echo "Package version in $SOURCE_BRANCH: $VERSION_NEXT"

test "$VERSION_LAST" != "$VERSION_NEXT" || { echo >&2 "Package version must be updated in $JSON_PATH"; exit 1; }
git rev-parse -q --verify "refs/tags/v$VERSION_NEXT" >/dev/null && { echo >&2 "Tag v$VERSION_NEXT already exists"; exit 1; }


# build to branch
echo "Switching to build branch: $BUILD_BRANCH"
git checkout $BUILD_BRANCH

BUILD_HEAD=`git rev-parse $BUILD_BRANCH`
echo "Saving origian build branch head: $BUILD_HEAD"

echo "Merging source branch: $SOURCE_BRANCH"
git merge --quiet --no-edit -X theirs $SOURCE_BRANCH

BUILD_PATH=`cd "$PACKAGE_PATH/build"; pwd`

echo "Clearing $BUILD_PATH"
rm -R $BUILD_PATH

echo "Building package: $PACKAGE_PATH"
cd "$PACKAGE_PATH"

if sencha ant -Dworkspace.packages.dir="$LIB_PATH" build ; then
    echo "Committing build"

    git add -f --all $BUILD_PATH
    git commit -m "Add build for v$VERSION_NEXT"

    echo "Creating release tag: v$VERSION_NEXT"
    git tag v$VERSION_NEXT

    echo "Returning to source branch"
    git checkout $SOURCE_BRANCH
else
    echo >&2 "Package build failed, restoring $BUILD_BRANCH and returning you to $SOURCE_BRANCH"
    git reset --hard $BUILD_HEAD
    git clean -df
    git checkout $SOURCE_BRANCH
    exit 1
fi