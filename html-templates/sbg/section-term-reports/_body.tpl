{extends "progress/section-term-reports/_body.tpl"}

{block fields}
    {$dwoo.parent}

    {$gradeLabels = array(
        "N/A" = "Standard not applicable during the semester",
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

    {if $.get.print.sbg_worksheet != 'no' && $worksheet && count($standardsGrades)}
        <div class="dli">
            <dt class="standards">Standards</dt>
            <dd class="standards">
                <article class="standard-worksheet">
                    <table class="prompts">
                        <thead>
                            <th class="prompt">Prompt</th>
                            <th class="grade">Grade</th>
                        </thead>
                        <tbody>
                            {foreach item=Grade from=$standardsGrades}
                                <tr>
                                    <td class="prompt">{$Grade.Prompt|escape}</td>
                                    <td class="grade">
                                        {if $Grade.Grade === null}
                                            <span class="muted">&mdash;</span>
                                        {elseif $Grade.Grade === 0}
                                            <span class="muted">N/A</span>
                                        {else}
                                            <strong>{$Grade.Grade}</strong>&nbsp;&nbsp;
                                            <span class="muted">{$gradeLabels[$Grade.Grade]}</span>
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