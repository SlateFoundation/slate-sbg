{extends "progress/narratives/print.tpl"}

{block narrative}
    {load_templates "subtemplates/sbg.tpl"}
    {studentnarrativestandards $Report}
{/block}