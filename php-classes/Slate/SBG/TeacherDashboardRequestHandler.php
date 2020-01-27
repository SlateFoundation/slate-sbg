<?php

namespace Slate\SBG;

class TeacherDashboardRequestHandler extends \RequestHandler
{
    public static function handleRequest()
    {
        $GLOBALS['Session']->requireAccountLevel('Staff');

        return \Emergence\Site\RequestHandler::sendResponse(TeacherDashboardApp::load()->render());
    }

}
