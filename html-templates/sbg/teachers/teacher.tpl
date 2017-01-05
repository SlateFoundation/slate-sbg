{extends designs/site.tpl}

{block title}Teachers &mdash; Standards &mdash; {$dwoo.parent}{/block}

{block "css"}
    {$dwoo.parent}
    <style>
        .visually-hidden {
            border: 0;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
        }

        .checkbox-field {
            margin-top: .3333em;
        }

		.table-ct {
			overflow: auto;
		}

        .standards-grid,
        .standards-grid-sections-table {
			table-layout: fixed;
        }

{*
        .standards-grid-sizing-cell {
            padding: 0;
            visibility: hidden;
        }

        .standards-grid-sizing-cell > div {
            height: 0;
            overflow: hidden;
        }
*}

        .standards-grid-sections-ct {
            background: #444;
            padding-left: 2em;
        }

        .standards-grid-section-column,
        .standards-grid-standard-column {
            width: 12em;
        }

        .standards-grid-sections-table .standards-grid-section-column {
            width: 10em;
        }

        .standards-grid-growth-column {
            width: 4.5em;
        }

        .standards-grid-group-header small {
            display: inline;
            margin-left: .25em;
        }

        .standards-grid-percent-cell,
        .standards-grid-rating-header {
            text-align: right;
        }

        thead th {
            background: #ddd;
            border-bottom-color: #ccc;
        }

        .standards-grid-rating-header-row > th {
            border-bottom: none;
        }

		.standards-grid-comparison-controls {
			display: flex;
			font-size: smaller;
		}

		.standards-grid-comparison-controls .field-control {
			flex: 1;
		}

		.standards-grid-comparison-controls .field-control + .field-control {
			margin-left: .5em;
		}

        .standards-grid-sections-table,
        .standards-grid-students-table {
            margin: 0;
        }

        tr:nth-child(even) > td,
        tr:nth-child(even) > th {
            background-color: #e5e5e5;
        }

        td {
            background: #f5f5f5;
        }

        td,
        th {
            background: white;
            border-left: 1px solid #ccc;
        }

        td:first-child,
        th:first-child {
            border-left: inherit;
        }

        .has-divider {
            border-left: 2px solid #888;
        }

        .standards-grid-student-column {
            width: 10%;
        }

        .standards-grid-timeframe-header-row th {
            text-align: center;
            width: 1%;
        }

        .standards-grid-rating-cell {
            text-align: center;
        }

        .standards-grid-sections-cell,
        .standards-grid-students-cell {
            background-color: #f5f5f5 !important;
            padding: 0;
        }

        .standards-grid-worksheet-header {
            background-color: #444 !important;
            border-top: 1px solid;
            color: white;
            -webkit-font-smoothing: antialiased;
        }

        .standards-grid-section-header {
            background-color: #888 !important;
            color: white;
            -webkit-font-smoothing: antialiased;
        }

        .standards-grid-negative {
            color: #c33;
        }

        .standards-grid-students-ct {
            background: #888;
            border-top: 2px solid #888;
            padding-left: 2em;
        }

        .bool-mark {
            border: 1px solid rgba(0, 0, 0, 0.3333);
            display: inline-block;
            height: 1em;
            overflow: hidden;
            text-indent: 2em;
            vertical-align: -.1875em;
            width: 1em;
        }

        .bool-mark.true {
            background-color: #3c3;
            border-radius: .5em;
        }

        .bool-mark.false {
            background-color: #c33;
        }



        /* Band-aid broken markup */
        td.standards-grid-standard-row {
            padding: 0;
        }

        .standards-grid-standard-header {
            font-size: small;
            line-height: 1.25;
            padding: 1em;
        }

        .standards-grid-section-header {
            border-bottom: 1px solid white;
            font-size: small;
            line-height: 1.25;
            padding: .5em;
        }
    </style>
{/block}

{block "content-wrapper"}
	<main class="content site" role="main">
		<div class="inner">
		    <header class="page-header">
		        <form method="GET" class="inline-fields">
		            {if $.get.jsdebug}
		                <input type="hidden" name="jsdebug" value="1">
		            {/if}
		            {capture assign=termSelect}
		                <select class="field-control inline medium" name="term" onchange="this.form.submit()">
		                    <option value="">&ndash;select&ndash;</option>
		                    {foreach item=availableTerm from=Slate\Term::getAllMaster()}
		                        <option value="{$availableTerm->Handle}" {refill field=term selected=$availableTerm->Handle default=$Term->Handle}>{$availableTerm->Title|escape}</option>
		                    {/foreach}
		                </select>
		            {/capture}
		            {labeledField html=$termSelect type=select label=Term class=auto-width}
		        </form>
		    </header>
		</div>

	    <div id='standardsCt'><div class="text-center"><img class="loading-spinner" src="/img/loaders/spinner.gif" alt=""> Loading {$Teacher->FullNamePossessive|escape} standards for {$Term->Title|escape}&hellip;</div></div>
	</main>
{/block}

{block js-bottom}
    <?php
        // collect related worksheets
        $this->scope['worksheets'] = array_values(array_filter(array_unique(
            array_map(function($WorksheetAssignment) {
                return $WorksheetAssignment->Worksheet;
            }, $this->scope['data'])
        )));

        // collect related terms
        $this->scope['worksheetTerms'] = array_values(array_unique(
            array_map(function($WorksheetAssignment) {
                return $WorksheetAssignment->Term;
            }, $this->scope['data'])
        ));

        // collect related terms
        $this->scope['worksheetCourseSections'] = array_values(array_unique(
            array_map(function($WorksheetAssignment) {
                return $WorksheetAssignment->CourseSection;
            }, $this->scope['data'])
        ));

        // collect all reports
        $termIds = array_map(function($Term) {
            return $Term->ID;
        }, $this->scope['worksheetTerms']);

        $courseSectionIds = array_map(function($CourseSection) {
            return $CourseSection->ID;
        }, $this->scope['worksheetCourseSections']);

        if (!empty($termIds) && !empty($courseSectionIds)) {
            $this->scope['reports'] = DB::allRecords(
                'SELECT TermID, SectionID, StudentID, SbgWorksheet FROM `%s` WHERE TermID IN (%s) AND SectionID IN (%s)',
                [
                    Slate\Progress\SectionTermReport::$tableName,
                    implode(',', $termIds),
                    implode(',', $courseSectionIds)
                ]
            );
        } else {
            $this->scope['reports'] = [];
        }

    ?>

    <script type="text/javascript">
        var SiteEnvironment = SiteEnvironment || { };
        SiteEnvironment.user = {$.User->getData()|json_encode};

        SiteEnvironment.standardsWorksheetAssignments = {JSON::translateObjects($data)|json_encode};
        SiteEnvironment.standardsTerm = {JSON::translateObjects($Term)|json_encode};
        SiteEnvironment.standardsTeacher = {JSON::translateObjects($Teacher)|json_encode};

        SiteEnvironment.standardsWorksheets = {JSON::translateObjects($worksheets, false, 'Prompts')|json_encode};
        SiteEnvironment.standardsWorksheetTerms = {JSON::translateObjects($worksheetTerms)|json_encode};
        SiteEnvironment.standardsWorksheetCourseSections = {JSON::translateObjects($worksheetCourseSections)|json_encode};
        SiteEnvironment.standardsReports = {JSON::translateObjects($reports)|json_encode};
    </script>

    {$dwoo.parent}

    {if $.get.jsdebug}
        {sencha_bootstrap
            patchLoader=false
            packages=array('slate-theme')
            packageRequirers=array('sencha-workspace/pages/src/page/StandardsTeacher.js')
        }
    {else}
        <script src="{Site::getVersionedRootUrl('js/pages/StandardsTeacher.js')}"></script>
    {/if}

    <script>
        Ext.require('Site.page.StandardsTeacher');
    </script>
{/block}