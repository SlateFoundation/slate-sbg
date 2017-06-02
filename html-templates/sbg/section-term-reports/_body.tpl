{extends "progress/section-term-reports/_body.tpl"}

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
        <div class="dli">
            <dt class="standards">Standards</dt>
            <dd class="standards">
                <article class="standard-worksheet">
                    <table class="prompts">
                        <tbody>
                            {foreach item=Grade from=$standardsGrades}
                                <tr>
                                    <td class="prompt">{$Grade.Prompt|escape}</td>
                                    <td class="grade">
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
                        </tbody>
                    </table>
                </article>
            </dd>
        </div>
    {/if}
{/block}