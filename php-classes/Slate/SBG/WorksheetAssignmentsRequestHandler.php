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
        if (!empty($_REQUEST['term'])) {
            if ($_REQUEST['term'] == 'current') {
                if (!$Term = Term::getClosest()) {
                    return static::throwInvalidRequestError('No current term could be found');
                }
            } elseif (!$Term = Term::getByHandle($_REQUEST['term'])) {
                return static::throwNotFoundError('term not found');
            }

            $conditions['TermID'] = $Term->ID;
        }

        if (!empty($_REQUEST['enrolled_user'])) {
            if ($_REQUEST['enrolled_user'] == 'current') {
                $GLOBALS['Session']->requireAuthentication();
                $EnrolledUser = $GLOBALS['Session']->Person;
            } elseif (!$EnrolledUser = User::getByHandle($_REQUEST['enrolled_user'])) {
                return static::throwNotFoundError('enrolled_user not found');
            }

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
}