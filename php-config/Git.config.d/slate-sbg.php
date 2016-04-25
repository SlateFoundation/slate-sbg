<?php

Git::$repositories['slate-sbg'] = [
    'remote' => 'https://github.com/SlateFoundation/slate-sbg.git',
    'originBranch' => 'builds/v1',
    'workingBranch' => 'builds/v1',
    'trees' => [
        'php-classes/Slate/SBG',
        'php-config/Git.config.d/slate-sbg.php',
        'php-config/Slate/Progress/Narratives/Report.config.d/sbg.php',
        'sencha-workspace/packages/slate-sbg',
        'site-root/sbg'
    ]
];
