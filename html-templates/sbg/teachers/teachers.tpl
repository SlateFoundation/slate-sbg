{extends designs/site.tpl}

{block title}Teachers &mdash; Standards &mdash; {$dwoo.parent}{/block}

{block content}
    <h1>Teachers for {$Term->Title|escape}</h1>

    <ul>
    {foreach item=Teacher from=$data}
        <li><a href="/sbg/teachers/{$Teacher->Username}">{$Teacher->LastName|escape}, {$Teacher->FirstName|escape}</li>
    {/foreach}
    </ul>
{/block}