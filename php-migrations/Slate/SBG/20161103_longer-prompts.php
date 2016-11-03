<?php

$tableName = 'sbg_worksheet_prompts';
$historyTableName = 'history_sbg_worksheet_prompts';
$columnName = 'Prompt';

// skip conditions
$skipped = true;
if (!static::tableExists($tableName)) {
    printf("Skipping migration because table `%s` does not exist yet\n", $tableName);
    return static::STATUS_SKIPPED;
}


// migration
if ('text' != static::getColumnType($tableName, $columnName)) {
    printf("Changing `%s` to TEXT in table `%s`'\n", $columnName, $tableName);
    DB::nonQuery('ALTER TABLE `%s` DROP KEY `WorksheetPrompt`, ADD KEY `WorksheetID` (`WorksheetID`), CHANGE `Prompt` `Prompt` text NOT NULL', $tableName);
    $skipped = false;
}

if ('text' != static::getColumnType($historyTableName, $columnName)) {
    printf("Changing `%s` to TEXT in table `%s`'\n", $columnName, $historyTableName);
    DB::nonQuery('ALTER TABLE `%s` CHANGE `Prompt` `Prompt` text NOT NULL', $historyTableName);
    $skipped = false;
}


// done
return $skipped ? static::STATUS_SKIPPED : static::STATUS_EXECUTED;