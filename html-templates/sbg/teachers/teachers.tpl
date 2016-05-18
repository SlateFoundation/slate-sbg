{extends designs/site.tpl}

{block title}Teachers &mdash; Standards &mdash; {$dwoo.parent}{/block}

{block content}
    <header class="page-header">
        <form method="GET" class="inline-fields">
            {if $.get.jsdebug}
                <input type="hidden" name="jsdebug" value="1">
            {/if}

            {capture assign=termSelect}
                <select class="field-control inline medium" name="term" onchange="this.form.submit()">
                    <option value="">&ndash;select&ndash;</option>
                    {foreach item=availableTerm from=Slate\Term::getAllMaster()}
                        <option value="{$availableTerm->Handle}" {refill field=term selected=$availableTerm->Handle default=$Term->Handle}>{$availableTerm->Title|escape}</option>
                    {/foreach}
                </select>
            {/capture}

            <h2>Teachers with worksheets in term {$termSelect}</h1>
        </form>
    </header>

    <ul>
    {foreach item=Teacher from=$data}
        <li><a href="/sbg/teachers/{$Teacher->Username}?{refill_query}">{$Teacher->LastName|escape}, {$Teacher->FirstName|escape}</li>
    {/foreach}
    </ul>
{/block}