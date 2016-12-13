<?php

namespace Slate\SBG;

use HandleBehavior;
use Slate\Progress\SectionTermReport;

class Worksheet extends \VersionedRecord
{
    // ActiveRecord configuration
    public static $tableName = 'sbg_worksheets';
    public static $singularNoun = 'standards worksheet';
    public static $pluralNoun = 'standards worksheets';
    public static $collectionRoute = '/sbg/worksheets';

    public static $fields = [
        'Title',
        'Handle' => [
            'unique' => true
        ],
        'Status' => [
            'type' => 'enum',
            'values' => ['published', 'deleted'],
            'default' => 'published'
        ],
        'Description' => [
            'notnull' => false
        ]
    ];

    public static $relationships = [
        'Prompts' => [
            'type' => 'one-many',
            'class' => WorksheetPrompt::class,
            'order' => 'Position'
        ],
        'PromptsByID' => [
            'type' => 'one-many',
            'class' => WorksheetPrompt::class,
            'indexField' => 'ID'
        ]
    ];

    public static $validators = [
        'Title' => [
            'errorMessage' => 'A title is required'
        ]
    ];

    public static $dynamicFields = [
        'Prompts',
        'TotalPrompts' => [
            'method' => [__CLASS__, 'getTotalPrompts']
        ]
    ];

    public function validate($deep = true)
    {
        // call parent
        parent::validate($deep);

        // implement handles
        HandleBehavior::onValidate($this, $this->_validator);

        // save results
        return $this->finishValidation();
    }

    public function save($deep = true)
    {
        // implement handles
        HandleBehavior::onSave($this);

        // call parent
        parent::save($deep);
    }

    public static function getTotalPrompts(Worksheet $Worksheet)
    {
        try {
            return (int)\DB::oneValue(
                'SELECT COUNT(*) FROM `%s` WHERE WorksheetID = %u',
                [
                    WorksheetPrompt::$tableName,
                    $Worksheet->ID
                ]
            );
        } catch (\TableNotFoundException $e) {
            return 0;
        }
    }

    public function destroy()
    {
        foreach ($this->Prompts AS $Prompt) {
            $Prompt->destroy();
        }

        $this->Status = 'deleted';
        $this->save();

        return true;
    }

    public static function delete($id)
    {
        $Worksheet = static::getbyId($id);

        return $Worksheet ? $Worksheet->destroy() : false;
    }

    public function getStandardsGrades(Report $Report)
    {

        $grades = [];
        $prompts = $this->Prompts;
        $sbgWorksheet = $Report->SbgWorksheet;
        $sbgWorksheetId = !empty($sbgWorksheet['worksheet_id']) ? $sbgWorksheet['worksheet_id'] : null;

        if ($sbgWorksheetId && !empty($sbgWorksheet['grades'])) {
            $worksheetGrades = $sbgWorksheet['grades'];
        }


        foreach ($prompts as $prompt) {
            $grades[] = [
                'TermID' => $Report->TermID,
                'CourseSectionID' => $Report->CourseSectionID,
                'StudentID' => $Report->StudentID,
                'PromptID' => $prompt->ID,
                'Prompt' => $prompt->Prompt,
                'Grade' => isset($worksheetGrades[$prompt->ID]) ? $worksheetGrades[$prompt->ID] : null
            ];
        }

        return $grades;
    }
}