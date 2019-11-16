<?php

namespace SlateSBGTeacher;


class WebApp extends \Emergence\WebApps\SenchaApp
{
    public static $plugins = [];


    public static function load($name = 'SlateStandardsBasedGradingTeacher')
    {
        return parent::load($name);
    }
}