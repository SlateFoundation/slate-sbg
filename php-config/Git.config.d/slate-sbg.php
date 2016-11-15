<?php

Git::$repositories['slate-sbg'] = [
    'remote' => 'https://github.com/SlateFoundation/slate-sbg.git',
    'originBranch' => 'builds/v1',
    'workingBranch' => 'builds/v1',
    'trees' => [
        'html-templates/sbg',
        'html-templates/progress/narratives/sbg-print.tpl',
        'html-templates/subtemplates/sbg.tpl',
        'php-classes/Slate/SBG',
        'php-config/Git.config.d/slate-sbg.php',
        'php-config/Slate/Progress/Narratives/Report.config.d/sbg.php',
        'php-config/Slate/UI/Tools.config.d/sbg.php',
        'sencha-workspace/packages/slate-sbg',
        'sencha-workspace/pages/src/page/StandardsTeacher.js',
        'site-root/sbg'
    ]
];
