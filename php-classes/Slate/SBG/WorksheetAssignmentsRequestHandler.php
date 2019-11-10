<?php

namespace Slate\SBG;

use DB;
use Emergence\People\User;

use Slate\Term;
use Slate\Courses\SectionParticipant;

class WorksheetAssignmentsRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass = WorksheetAssignment::class;
    public static $accountLevelBrowse = 'Staff';

    public static function handleBrowseRequest($options = [], $conditions = [], $responseID = null, $responseData = [])
    {

        $requestData = $_REQUEST;
        $Terms = static::_getRequestedTerms($requestData);
        $Teacher = static::_getRequestedTeacher($requestData);
        $EnrolledUser = static::_getRequestedEnrolledUser($requestData);


        if (!empty($Terms)) {
            if (count($Terms) === 1) {
                $firstTerm = array_shift($Terms);
                $conditions['TermID'] = $firstTerm->ID;
            } else {
                $conditions['TermID'] = [
                    'operator' => 'IN',
                    'values' => array_keys($Terms)
                ];
            }
        }


        if (count($Terms) === 1 && $Teacher) {
            $firstTerm = array_shift($Terms);
            $worksheetAssignmentIds = DB::getValues(
                'WorksheetAssignment.ID',

                'SELECT'
                .'  WorksheetAssignment.ID'
                .' FROM'
                .'  ('
                .'    SELECT * FROM `%s` WHERE TermID IN (%s)'
                .'  ) WorksheetAssignment'
                .' JOIN `%s` Participant'
                .'   ON (Participant.CourseSectionID = WorksheetAssignment.CourseSectionID AND Participant.PersonID = %u AND Participant.Role = "Teacher")'

                ,[
                    WorksheetAssignment::$tableName,
                    implode(',', $firstTerm->getRelatedTermIDs()),
                    SectionParticipant::$tableName,
                    $Teacher->ID
                ]
            );

            $conditions['ID'] = [
                'operator' => 'IN',
                'values' => $worksheetAssignmentIds
            ];

        } elseif ($EnrolledUser) {
            $enrolledSectionIds = DB::allValues(
                'CourseSectionID',
                'SELECT CourseSectionID FROM `%s` WHERE PersonID = %u',
                [
                    SectionParticipant::$tableName,
                    $EnrolledUser->ID
                ]
            );

            $conditions[] = sprintf('CourseSectionID IN (%s)', count($enrolledSectionIds) ? join(',', $enrolledSectionIds) : '0');
        }

        return parent::handleBrowseRequest($options, $conditions, $responseID, $responseData);
    }

    protected static function _getRequestedTerms($requestData = [])
    {
        $Terms = [];

        if (!empty($requestData['term'])) {
            if ($requestData['term'] == 'current') {
                if (!$Term = Term::getClosest()) {
                    return static::throwInvalidRequestError('No current term could be found');
                }
            } elseif (!$Term = Term::getByHandle($requestData['term'])) {
                return static::throwNotFoundError(sprintf('term %s not found', $requestData['term']));
            }

            $Terms[$Term->ID] = $Term;

        } else if (!empty($requestData['related_terms']) && is_array($requestData['related_terms'])) {
            foreach ($requestData['related_terms'] as $termId) {
                if (!$Term = Term::getByHandle($termId)) {
                    return static::throwNotFoundError(sprintf('term %s not found', $termId));
                }

                $Terms[$Term->ID] = $Term;
            }
        }

        return $Terms;
    }

    protected static function _getRequestedTeacher($requestData = [])
    {
        $Teacher = null;
        if (!empty($requestData['teacher'])) {
            if (!$Teacher = User::getByHandle($requestData['teacher'])) {
                return static::throwNotFoundError(sprintf('teacher %s not found.', $requestData['teacher']));
            }
        }

        return $Teacher;
    }

    protected static function _getRequestedEnrolledUser($requestData = [])
    {
        $User = null;
        if (!empty($requestData['enrolled_user'])) {
            if ($requestData['enrolled_user'] == 'current') {
                $GLOBALS['Session']->requireAuthentication();
                $User = $GLOBALS['Session']->Person;
            } elseif (!$User = User::getByHandle($requestData['enrolled_user'])) {
                return static::throwNotFoundError(sprintf('enrolled_user %s not found', $requestData['enrolled_user']));
            }
        }

        return $User;
    }
}