<?php

namespace Slate\Progress;

SectionTermReport::$fields['SbgWorksheet'] = [
    'type' => 'json',
    'notnull' => false
];

SectionTermReport::$relationships['SbgWorksheetMaster'] = [
    'type' => 'one-one',
    'class' => \Slate\SBG\Worksheet::class,
    'link' => function(SectionTermReport $Report) {
        $worksheet = $Report->SbgWorksheet;

        if (!$worksheet || empty($worksheet['worksheet_id'])) {
            return null;
        }

        return [
            'ID' => $worksheet['worksheet_id']
        ];
    }
];

SectionTermReport::$bodyTpl = 'sbg/section-term-reports/sectionTermReport.body';
SectionTermReport::$cssTpl = 'sbg/section-term-reports/sectionTermReport.css';