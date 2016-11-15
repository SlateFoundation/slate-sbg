{template standards Report gradeLabels}
    <!-- begin standards -->
        {$worksheet = $Report->SbgWorksheetMaster}
        {if $worksheet}
            {$standardsGrades = $worksheet->getStandardsGrades($Report)}
        {else}
            {$standardsGrades = array()}
        {/if}

        {if $worksheet && count($standardsGrades)}
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
        {/if}
    <!-- end standards -->
{/template}

{template studentnarrativestandards Report}
    {$gradeLabels = array(
        "N/A" = "Standard not Applicable during the Semester"
        ,1 = "Not currently meeting expectations"
        ,2 = "Approaching expectations"
        ,3 = "Meeting expectations"
        ,4 = "Exceeding expectations"
    )}
    <article class="narrative">

        <h2>{$Report->Section->Title|escape}</h2>

        <dl>
        {if $Report->Section->Instructors[0]->FullName}
            <dt class="instructor">Instructor</dt>
            <dd class="instructor">
                {$Report->Section->Instructors[0]->FullName}
                {if $Report->Section->Instructors[0]->Email}
                    <a href="mailto:{$Report->Section->Instructors[0]->Email}">&lt;{$Report->Section->Instructors[0]->Email}&gt;</a>
                {/if}
            </dd>
        {/if}

        {if $Report->Grade}
            <dt class="grade">Overall Grade</dt>
            <dd class="grade">{$Report->Grade}</dd>
        {/if}

        {standards $Report $gradeLabels}

        {if $Report->Assessment}
            <dt class="assessment">Assessment</dt>
            <dd class="assessment">{$Report->Assessment}</dd>
        {/if}

        {if $Report->Notes}
            <dt class="comments">Comments</dt>
            <dd class="comments">{$Report->Notes}</dd>
        {/if}
        </dl>
    </article>
{/template}