<?php

namespace Slate\Progress\Narratives;

SectionTermReport::$fields['SbgWorksheet'] = [
    'type' => 'json',
    'notnull' => false
];

SectionTermReport::$relationships['SbgWorksheetMaster'] = [
    'type' => 'one-one',
    'class' => \Slate\SBG\Worksheet::class,
    'link' => function(Report $Report) {
        $worksheet = $Report->SbgWorksheet;

        if (!$worksheet || empty($worksheet['worksheet_id'])) {
            return null;
        }

        return [
            'ID' => $worksheet['worksheet_id']
        ];
    }
];

SectionTermReport::$printTemplate = 'sbg-print';