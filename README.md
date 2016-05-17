# slate-sbg
Generic standards-based grading capabilities for Slate

## Release Process
1. Commit or merge changes into the `master` branch
2. Run from the root of the repository: `./update-build.sh`
3. Inspect new commits to `builds/v1` branch
4. Push `builds/v1` branch: `git push origin builds/v1`
5. Push tags: `git push --tags`
6. Add release notes to new tag on GitHub


## Installation Process
1. Copy [sample `slate-sbg.php` git config script](https://github.com/SlateFoundation/slate-sbg/blob/master/php-config/Git.config.d/slate-sbg.php) into site
2. Visit `/git/status` and initialize the `slate-sbg` layer
3. Return to `/git/status` and click <kbd>Disk → VFS</kbd> for the `slate-sbg` layer
