# slate-sbg
Generic standards-based grading capabilities for Slate

## Release Process
1. Open Pull Request from `master` to `releases/v1` with title "Release: slate-sbg vX.Y.Z"
2. Draft release notes in pull request
3. Merge and close pull request
4. Create release against `releases/v1` with title "slate-sbg vX.Y.Z" with release notes from PR copied
5. Checkout latest `releases/v1` locally and then checkout new branch with `git checkout -b builds/vX.Y.Z`
6. Change directory into `sencha-workspace/packages/slate-sbg` and execute `sencha package build`
7. Force add ignored build directory to build branch history with `git add -f build`
8. Push new build branch to server with `git push -u origin builds/vX.Y.Z`
9. Check out major version build branch with `git checkout builds/v1`
10. Merge latest build into major version build branch with `git merge --strategy-option theirs builds/vX.Y.Z`
11. Push major build branch to server with `git push origin builds/v1`
