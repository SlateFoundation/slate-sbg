{extends "progress/section-term-reports/_body.email.tpl"}

{block fields}
    {$dwoo.parent}

    {$gradeLabels = array(
        "N/A" = "Standard not Applicable during the Semester",
        1 = "Not currently meeting expectations",
        2 = "Approaching expectations",
        3 = "Meeting expectations",
        4 = "Exceeding expectations"
    )}

    {$worksheet = $Report->SbgWorksheetMaster}
    {if $worksheet}
        {$standardsGrades = $worksheet->getStandardsGrades($Report)}
    {else}
        {$standardsGrades = array()}
    {/if}

    {if $worksheet && count($standardsGrades)}
        <span style="color: #5e6366; font-size: smaller; font-style: italic;">Standards</span>
        <br />
        <div style="display: block; margin: 0 1.5em;">
            <table border="0" width="100%">
                {foreach item=Grade from=$standardsGrades}
                    <tr>
                        <td class="prompt" style="{if !$.foreach.default.first}border-top: 1px dotted #999;{/if} padding: 0.5em 0">
                            {$Grade.Prompt|escape}
                        </td>
                        <td class="grade" style="{if !$.foreach.default.first}border-top: 1px dotted #999;{/if} padding: 0.5em 0; text-align: right;">
                            {if $Grade.Grade === null}
                                -
                            {elseif $Grade.Grade === 0}
                                N/A
                            {else}
                                {$gradeLabels[$Grade.Grade]}
                            {/if}
                        </td>
                    </tr>
                {/foreach}
            </table>
        </div>
    {/if}
{/block}