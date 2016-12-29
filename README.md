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

## Usage Notes

### Worksheets
- Standards-based grading begins with creating worksheets. A worksheet is an ordered list of prompts.
- Prompts represent standards, but currently only exist within a worksheet. There is no way to assign reusable codes to prompts or associate the same prompt across multiple worksheets.
- Prompts in existing worksheets can be edited, but this should only be done to add clarity or make corrections. Prompts that have already been graded against should not be reworded to the point that they're a new standard. Changes to prompt language apply retroactively to all past terms.

### Grading
- By default, prompts can be graded on a scale of 1-4, plus the special value `N/A`. Grading options can be customized by plugins

### Reporting
- Growth can only be calculated when the same worksheet is graded against for multiple terms.
- New prompts can be added to an existing worksheet, and the worksheet can still be compared across terms aside from the new prompts that only one grade is available for
