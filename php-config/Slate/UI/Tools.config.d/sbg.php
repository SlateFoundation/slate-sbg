<?php

if (empty($GLOBALS['Session']) || !$GLOBALS['Session']->hasAccountLevel('Staff')) {
    return;
}

Slate\UI\Tools::$tools['Standards-Based Grading'] = [
    'Narratives' => [
        '_href' => '/manage#progress/narratives',
        '_icon' => 'documents'
    ],
    'Standards' => [
        '_href' => '/manage#progress/standards',
        '_icon' => 'clipboard'
    ],
    'Interims' => [
        '_href' => '/manage#progress/interims',
        '_icon' => 'interims'
    ],
    'Progress Notes' => [
        '_href' => '/manage#progress/notes',
        '_icon' => 'notes'
    ],
    'Growth Dashboard' => [
        '_href' => '/sbg/teachers',
        '_icon' => 'area-chart'
    ]
];