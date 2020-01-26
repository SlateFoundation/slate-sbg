<?php

namespace Slate\SBG;

use Emergence\People\User;
use Slate\Term;
use Slate\Courses\SectionParticipant;

use Slate\SBG\Worksheet;
use Slate\SBG\WorksheetAssignment;

class TeachersRequestHandler extends \RequestHandler
{
    public static $userResponseModes = array(
        'application/json' => 'json'
        ,'text/csv' => 'csv'
    );

    public static function handleRequest()
    {
        $GLOBALS['Session']->requireAccountLevel('Staff');

        $path = static::shiftPath();

        if ($path === 'app') {
            return static::handleTeacherAppRequest();
        } else if ($path) {
            if (!$Teacher = User::getByHandle($path)) {
                return static::throwNotFoundError('Teacher not found');
            }
            return static::handleTeacherRequest($Teacher);
        } else {
            $Term = static::_getRequestedTerm();
            return static::respond('teachers', [
                'data' => User::getAllByQuery(
                    'SELECT DISTINCT'
                    .'  Person.*'
                    .' FROM'
                    .'  ('
                    .'    SELECT DISTINCT CourseSectionID FROM `%s` WHERE TermID IN (%s)'
                    .'  ) WorksheetAssignment'
                    .' JOIN `%s` Participant'
                    .'   ON (Participant.CourseSectionID = WorksheetAssignment.CourseSectionID AND Participant.Role = "Teacher")'
                    .' JOIN `%s` Person'
                    .'   ON (Person.ID = Participant.PersonID)'
                    .' ORDER BY Person.LastName, Person.FirstName',
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

    public static function handleTeacherAppRequest()
    {
        $GLOBALS['Session']->requireAccountLevel('Staff');
        return \Emergence\Site\RequestHandler::sendResponse(TeacherApp::load()->render());
    }

    public static function handleTeacherRequest(User $Teacher)
    {
        $GLOBALS['Session']->requireAccountLevel('Staff');


        $Term = static::_getRequestedTerm();


        return static::respond('teacher', [
            'data' => WorksheetAssignment::getAllByQuery(
                'SELECT'
                .'  WorksheetAssignment.*'
                .' FROM'
                .'  ('
                .'    SELECT * FROM `%s` WHERE TermID IN (%s)'
                .'  ) WorksheetAssignment'
                .' JOIN `%s` Participant'
                .'   ON (Participant.CourseSectionID = WorksheetAssignment.CourseSectionID AND Participant.PersonID = %u AND Participant.Role = "Teacher")'
                ,[
                    WorksheetAssignment::$tableName,
                    implode(',', $Term->getRelatedTermIDs()),
                    SectionParticipant::$tableName,
                    $Teacher->ID
                ]
            ),
            'Teacher' => $Teacher,
            'Term' => $Term
        ]);
    }

    protected static function _getRequestedTerm()
    {
        if (empty($_GET['term'])) {
            return Term::getClosest()->getMaster();
        }

        if (!$Term = Term::getByHandle($_GET['term'])) {
            throw new \Exception('Invalid term');
        }

        return $Term;
    }
}