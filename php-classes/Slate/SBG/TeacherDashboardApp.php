<?php

namespace Slate\SBG;

class TeacherDashboardApp extends \Emergence\WebApps\SenchaApp
{
    public static $plugins = [];


    public static function load($name = 'SlateStandardsBasedGradingTeacher')
    {
        return parent::load($name);
    }
}