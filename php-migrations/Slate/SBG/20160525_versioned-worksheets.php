<?php


// add columns to all history_ tables
$classes = [
    \Slate\SBG\Worksheet::class,
    \Slate\SBG\WorksheetPrompt::class,
    \Slate\SBG\WorksheetAssignment::class
];

foreach ($classes AS $class) {
    printf("Creating `%s` and `%s` tables if needed\n", $class::$tableName, $class::getHistoryTableName());
    \DB::multiQuery(\SQL::getCreateTable($class));

    // ensure main table has modified/modifier columns
    if (!static::columnExists($class::$tableName, 'Modified')) {
        printf("Adding `Modified` column to `%s` table\n", $class::$tableName);
        DB::nonQuery('ALTER TABLE `%s` ADD `Modified` timestamp NULL default NULL AFTER `CreatorID`', $class::$tableName);
    }

    if (!static::columnExists($class::$tableName, 'ModifierID')) {
        printf("Adding `ModifierID` column to `%s` table\n", $class::$tableName);
        DB::nonQuery('ALTER TABLE `%s` ADD `ModifierID` int unsigned NULL default NULL AFTER `Modified`', $class::$tableName);
    }

    // ensure history table has modified/modifier columns
    if (!static::columnExists($class::getHistoryTableName(), 'Modified')) {
        printf("Adding `Modified` column to `%s` table\n", $class::getHistoryTableName());
        DB::nonQuery('ALTER TABLE `%s` ADD `Modified` timestamp NULL default NULL AFTER `CreatorID`', $class::getHistoryTableName());
    }

    if (!static::columnExists($class::getHistoryTableName(), 'ModifierID')) {
        printf("Adding `ModifierID` column to `%s` table\n", $class::getHistoryTableName());
        DB::nonQuery('ALTER TABLE `%s` ADD `ModifierID` int unsigned NULL default NULL AFTER `Modified`', $class::getHistoryTableName());
    }
}


// done
return static::STATUS_EXECUTED;