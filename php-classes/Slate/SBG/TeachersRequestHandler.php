<?php

namespace Slate\SBG;

use Emergence\People\User;
use Slate\Term;
use Slate\Courses\SectionParticipant;

use Slate\SBG\Worksheet;
use Slate\SBG\WorksheetAssignment;

class TeachersRequestHandler extends \Slate\RecordsRequestHandler
{
    public static $userResponseModes = [
        'application/json' => 'json',
        'text/csv' => 'csv'
    ];

    public static function handleRequest()
    {
        $GLOBALS['Session']->requireAccountLevel('Staff');

        if (!$Term = static::getRequestedTerm()) {
            return static::throwInvalidRequestError('term required');
        }

        return static::respond('teachers', [
            'data' => User::getAllByQuery(
                '
                    SELECT DISTINCT
                           Person.*
                      FROM (
                              SELECT DISTINCT CourseSectionID FROM `%s` WHERE TermID IN (%s)
                           ) WorksheetAssignment
                      JOIN `%s` Participant
                        ON (
                              Participant.CourseSectionID = WorksheetAssignment.CourseSectionID
                              AND Participant.Role = "Teacher"
                           )
                      JOIN `%s` Person
                        ON (Person.ID = Participant.PersonID)
                     ORDER BY Person.LastName, Person.FirstName
                ',
                [
                    WorksheetAssignment::$tableName,
                    implode(',', $Term->getRelatedTermIDs()),
                    SectionParticipant::$tableName,
                    User::$tableName
                ]
            ),
            'Term' => $Term
        ]);
    }
}
