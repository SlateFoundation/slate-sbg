<?php

if (empty($GLOBALS['Session']) || !$GLOBALS['Session']->hasAccountLevel('Staff')) {
    return;
}

Slate\UI\Tools::$tools['Standards-Based Grading']['Growth Dashboard'] = [
    '_href' => '/sbg/teachers/app',
    '_icon' => 'area-chart'
];