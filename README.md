# slate-sbg

Generic standards-based grading capabilities for Slate

## Adding to a school site

1. Create `slate-sbg` source using `releases/v2` branch:

    ```bash
    git holo source create https://github.com/SlateFoundation/slate-sbg --ref=releases/v2
    ```

1. Create `.holo/branches/emergence-site/_slate-sbg.toml` to map all content in the `emergence-layer` holobranch into the root of your site projection:

    ```toml
    [holomapping]
    holosource="=>emergence-layer"
    files = "**"
    ```

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
