<?php

namespace Slate\SBG;

class WorksheetPrompt extends \VersionedRecord
{
    // ActiveRecord configuration
    public static $tableName = 'sbg_worksheet_prompts';
    public static $singularNoun = 'standards worksheet prompt';
    public static $pluralNoun = 'standards worksheet prompts';
    public static $collectionRoute = '/sbg/worksheet-prompts';
    public static $updateOnDuplicateKey = true;

    public static $fields = [
        'WorksheetID' => [
            'type' => 'uint',
            'index' => true
        ],
        'Position' => [
            'type' => 'uint',
            'default' => 1
        ],
        'Prompt' => 'clob',
        'Status' => [
            'type' => 'enum',
            'values' => ['published', 'deleted'],
            'default' => 'published'
        ]
    ];

    public static $relationships = [
        'Worksheet' => [
            'type' => 'one-one',
            'class' => Worksheet::class
        ]
    ];

    public static $validators = [
        'Worksheet' => 'require-relationship',
        'Prompt'
    ];

    public function destroy()
    {
        $this->Status = 'deleted';
        $this->save();

        return true;
    }

    public static function delete($id)
    {
        $Prompt = static::getbyId($id);

        return $Prompt ? $Prompt->destroy() : false;
    }
}