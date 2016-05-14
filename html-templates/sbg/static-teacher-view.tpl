{extends 'designs/site.tpl'}

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

        .standards-grid-section-column {
            width: 10em;
        }

        .standards-grid-sections-table .standards-grid-section-column {
            width: 8em;
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

        .standards-grid-teacher-header {
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
    </style>
{/block}

{block "content"}
    <header class="page-header">
        <div class="inline-fields">
            {capture assign=searchField}
                <input class="field-control xlarge" type="search" placeholder="Search departments, sections, teachers, or students">
            {/capture}
            {labeledField html=$searchField class=xlarge}

            {capture assign=yearSelect}
                <select class="field-control inline">
                    <option>2014</option>
                </select>
            {/capture}
            {labeledField html=$yearSelect type=select class=auto-width}

            {checkbox inputName=slo value=true label='SLO only'}
        </div>
    </header>

    {$S = 'standards-grid'}

    {template cell class=null content='&nbsp;' header=false span=null divider=false}{strip}
        {$S = 'standards-grid'}
        {capture assign=el}{tif $header ? th : td}{/capture}
        {capture assign=cls}{tif $header ? 'header' : 'cell'}{/capture}
        <{$el} class="{$S}-{if $class}{$class}-{/if}{$cls} {if $divider}has-divider{/if}" {if $span}colspan={$span}{/if}>{$content}</{$el}>
    {/strip}{/template}

    {template sectionsTable}
        {$S = 'standards-grid'}

        <table class="{$S}-sections-table">
            <colgroup class="{$S}-section-column">
            <colgroup class="{$S}-growth-column">
            <colgroup class="{$S}-delta-columns">
                <col class="{$S}-nm-column">
                <col class="{$S}-a-column">
                <col class="{$S}-m-column">
                <col class="{$S}-e-column">
            </colgroup>
            {for i 1 3}
            <colgroup class="{$S}-q{$i}-columns">
                <col class="{$S}-nm-column">
                <col class="{$S}-a-column">
                <col class="{$S}-m-column">
                <col class="{$S}-e-column">
            </colgroup>
            {/for}

            {for section 1 4}
                <tbody class="{$S}-section-body">
{*
                    <tr class="{$S}-sizing-row">
                        {for i 1 18}{cell sizing '<div>0000</div>'}{/for}
                    </tr>
*}
                    <tr class="{$S}-section-row">{cell section 'Course Section $section' header=true span=18}</tr>
                    {for standard 1 4}
                        <tr class="{$S}-standard-row">
                            {$percent = rand(0, 100)}
                            {cell standard 'Standard $standard' header=true}
                            {cell percent  '$percent'}
                            {for cell 1 4}
                                {$percent  = rand(-100, 100)}
                                {$negative = tif($percent<0 ? true)}
                                {$divider  = tif($cell==1 ? true)}
                                {capture assign=figure}{strip}
                                    {if $negative}
                                        <span class="standards-grid-negative">−  {* proper minus (U+2212) *}
                                    {/if}
                                    {abs($percent)}
                                    {if $negative}</span>{/if}
                                {/strip}{/capture}
                                {cell percent $figure divider=$divider}
                            {/for}
                            {for cell 1 3}
                                {$p1 = rand()}
                                {$p2 = rand()}
                                {$p3 = rand()}
                                {$p4 = rand()}
                                {$sum = math('$p1 + $p2 + $p3 + $p4')}
                                {$percent1 = math('$p1/$sum*100')}
                                {$percent2 = math('$p2/$sum*100')}
                                {$percent3 = math('$p3/$sum*100')}
                                {$percent4 = math('$p4/$sum*100')}
                                {cell percent '$percent1|round' divider=true}
                                {cell percent '$percent2|round'}
                                {cell percent '$percent3|round'}
                                {cell percent '$percent4|round'}
                            {/for}
                        </tr>
                    {/for}
                </tbody>
            {/for}
            <tbody class="{$S}-students-body">
                <tr class="{$S}-students-row">
                    <td class="{$S}-students-cell" colspan="18">
                        <div class="{$S}-students-ct">
                            <table class="{$S}-students-table">
                                <colgroup class="{$S}-student-column">
                                <colgroup class="{$S}-rating-column" span="16">
                    
                                <thead class="{$S}-students-header">
                                    <tr class="{$S}-standards-header-row">
                                        {cell name 'Student' true}
                                        {for i 1 4}
                                            {cell standard 'Standard $i' true 4 true}
                                        {/for}
                                    </tr>
                                    <tr class="{$S}-timeframe-header-row">
                                        {cell blank header=true}
                                        {for i 1 4}
                                            {for j 1 3}
                                                {$divider = tif($j==1 ? true)}
                                                {cell timeframe 'Q$j' true divider=$divider}
                                            {/for}
                                            {cell growth '<span class="visually-hidden">Growth</span>' true}
                                        {/for}
                                    </tr>
                                </thead>

                                <tbody class="{$S}-students-body">
                                    {for i 1 4}
                                        {foreach item=student from=array(
                                            'Jessie Cunningham',
                                            'Christian Kunkel',
                                            'Chris Alfano',
                                            'Nafis Bey',
                                            'John Fazio'
                                        )}
                                            <tr class="{$S}-student-row">
                                                {cell student $student true}
                                                {cell rating '<span class="$S-negative">NM</span>' divider=true}
                                                {cell rating '<span class="$S-negative">A</span>'}
                                                {cell rating 'M'}
                                                {cell rating '<div class="bool-mark true">Yes</div>'}
                                                {cell rating '<span class="$S-negative">A</span>' divider=true}
                                                {cell rating 'M'}
                                                {cell rating 'M'}
                                                {cell rating '<div class="bool-mark true">Yes</div>'}
                                                {cell rating 'M' divider=true}
                                                {cell rating 'M'}
                                                {cell rating '<span class="$S-negative">A</span>'}
                                                {cell rating '<div class="bool-mark false">No</div>'}
                                                {cell rating 'E' divider=true}
                                                {cell rating 'M'}
                                                {cell rating 'M'}
                                                {cell rating '<div class="bool-mark false">No</div>'}
                                            </tr>
                                        {/foreach}
                                    {/for}
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    {/template}

    <div class="{$S}-ct">
        <table class="{$S}">
            <colgroup class="{$S}-section-column">
            <colgroup class="{$S}-growth-column">
            <colgroup class="{$S}-delta-columns">
                <col class="{$S}-nm-column">
                <col class="{$S}-a-column">
                <col class="{$S}-m-column">
                <col class="{$S}-e-column">
            </colgroup>
            {for i 1 3}
            <colgroup class="{$S}-q{$i}-columns">
                <col class="{$S}-nm-column">
                <col class="{$S}-a-column">
                <col class="{$S}-m-column">
                <col class="{$S}-e-column">
            </colgroup>
            {/for}

            <thead class="{$S}-header">
{*
                <tr class="{$S}-sizing-row">
                    {for i 1 18}<td class="{$S}-sizing-cell" aria-hidden="true"><div>0000</div></td>{/for}
                </tr>
*}
                <tr class="{$S}-group-header-row">
                    {cell blank header=true}
                    {cell group Growth true}
                    {cell group Delta true 4 true}
                    {for i 1 3}
                        {capture assign=q}Q{$i} <small>2014–15</small>{/capture}
                        {cell group $q true 4 true}
                    {/for}
                </tr>
                <tr class="{$S}-rating-header-row">
                    {cell blank header=true}
                    {cell rating '(%)' true}
                    {for i 1 4}
                        {cell rating '<abbr title="Not Meeting">NM</abbr>' true divider=true}
                        {cell rating '<abbr title="Approaching">A</abbr>' true}
                        {cell rating '<abbr title="Meeting">M</abbr>' true}
                        {cell rating '<abbr title="Exceeding">E</abbr>' true}
                    {/for}
                </tr>
            </thead>

            {for teacher 1 4}
            <tbody class="{$S}-teacher-body">
                <tr class="{$S}-teacher-row">{cell teacher 'Teacher Name $teacher' header=true span=18}</tr>
                {for standard 1 4}
                    <tr class="{$S}-standard-row">
                        {$percent = rand(0, 100)}
                        {cell standard 'Standard $standard' header=true}
                        {cell percent  '$percent'}
                        {for cell 1 4}
                            {$percent  = rand(-100, 100)}
                            {$negative = tif($percent<0 ? true)}
                            {$divider  = tif($cell==1 ? true)}
                            {capture assign=figure}{strip}
                                {if $negative}
                                    <span class="standards-grid-negative">−  {* proper minus (U+2212) *}
                                {/if}
                                {abs($percent)}
                                {if $negative}</span>{/if}
                            {/strip}{/capture}
                            {cell percent $figure divider=$divider}
                        {/for}
                        {for cell 1 3}
                            {$p1 = rand()}
                            {$p2 = rand()}
                            {$p3 = rand()}
                            {$p4 = rand()}
                            {$sum = math('$p1 + $p2 + $p3 + $p4')}
                            {$percent1 = math('$p1/$sum*100')}
                            {$percent2 = math('$p2/$sum*100')}
                            {$percent3 = math('$p3/$sum*100')}
                            {$percent4 = math('$p4/$sum*100')}
                            {cell percent '$percent1|round' divider=true}
                            {cell percent '$percent2|round'}
                            {cell percent '$percent3|round'}
                            {cell percent '$percent4|round'}
                        {/for}
                    </tr>
                {/for}
                <tr class="{$S}-sections-row">
                    <td class="{$S}-sections-cell" colspan="18">
                        <div class="{$S}-sections-ct">
                            {sectionsTable}
                        </div>
                    </td>
                </tr>
            </tbody>
            {/for}
        </table>
    </div>
{/block}