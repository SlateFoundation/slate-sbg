{extends "webapps/slate-sencha.tpl"}

{block meta}
    {$title = "Standards Based Grading Teacher"}

    {$dwoo.parent}
{/block}

{block body}
    {$dwoo.parent}

     <div class="wrapper site">
        <main class="content site" role="main">
            <div id="slateapp-viewport">
                <!-- app renders here -->
                <div id='standardsCt'><div class="text-center"><img class="loading-spinner" src="/img/loaders/spinner.gif" alt=""> Loading standards&hellip;</div></div>
            </div>
        </main>
    </div>

{/block}