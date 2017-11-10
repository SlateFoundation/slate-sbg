<?php

Git::$repositories['slate-sbg'] = [
    'remote' => 'https://github.com/SlateFoundation/slate-sbg.git',
    'originBranch' => 'builds/v1',
    'workingBranch' => 'builds/v1',
    'trees' => [
        'php-config/Git.config.d/slate-sbg.php',
        'html-templates/sbg',
        'php-classes/Slate/SBG',
        'php-config/Slate/Progress/SectionTermReport.config.d/50_sbg.php',
        'php-config/Slate/UI/Tools.config.d/sbg.php',
        'php-config/SlateAdmin.config.d/sbg.php',
        'php-migrations/Slate/SBG',
        'sencha-workspace/packages/slate-sbg',
        'sencha-workspace/pages/src/page/StandardsTeacher.js',
        'site-root/sass/reports/sbg.scss',
        'site-root/sbg'
    ]
];
