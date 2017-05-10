/*jslint browser: true, undef: true *//*global Ext*/
// @require-package slate-core-data
// @require-package slate-sbg
Ext.define('Site.page.StandardsTeacher', {
    singleton: true,
    requires: [
        'Site.Common',
        'Slate.store.Terms',
        'Slate.store.CourseSections',
        'Slate.store.progress.SectionTermReports',
        'Slate.sbg.store.StandardsWorksheets',
        'Slate.sbg.store.StandardsWorksheetAssignments',
        'Ext.XTemplate'
    ],


    baseCls: 'standards-grid',
    tableTpl: [
        // TODO: declare sub-tpls within the template object?
        '{% var baseCls = values.baseCls %}',
        '{% var totalColumns = 6 + values.terms.getCount() * 4 %}',
        '{% this.terms = values.terms %}',
        '{% this.changeUnit = values.changeUnit %}',
        '{% this.termFirst = values.termFirst %}',
        '{% this.termLast = values.termLast %}',
        '{% this.reports = values.reports %}',

        '<div class="table-ct">',
            '<table class="{[baseCls]}">',
                '<colgroup class="{[baseCls]}-standard-column">',
                '<colgroup class="{[baseCls]}-growth-column">',
                '<colgroup class="{[baseCls]}-delta-columns">',
                    '<col class="{[baseCls]}-nm-column">',
                    '<col class="{[baseCls]}-a-column">',
                    '<col class="{[baseCls]}-m-column">',
                    '<col class="{[baseCls]}-e-column">',
                '</colgroup>',
                '<tpl for="terms">',
                    '<colgroup class="{[baseCls]}-q{[xindex]}-columns">',
                        '<col class="{[baseCls]}-nm-column">',
                        '<col class="{[baseCls]}-a-column">',
                        '<col class="{[baseCls]}-m-column">',
                        '<col class="{[baseCls]}-e-column">',
                    '</colgroup>',
                '</tpl>',


                '<thead class="{[baseCls]}-header">',

                    '<tr class="{[baseCls]}-group-header-row">',
                        '<th class="{[baseCls]}-grid-blank-header">&nbsp;</th>',
                        '<th class="{[baseCls]}-grid-group-header" colspan="5">',
                            'Compare (',
                                '<select name="change-unit">',
                                    '<option value="percent" {[this.changeUnit == "percent" ? "selected" : ""]}>%</option>',
                                    '<option value="count" {[this.changeUnit == "count" ? "selected" : ""]}>&Delta;</option>',
                                '</select>',
                            '):',
                            '<div class="{[baseCls]}-comparison-controls">',
                                '<select name="term-first" class="field-control">',
                                    '<tpl for="this.terms">',
                                        '<option',
                                            ' value="{[values.getId()]}"',
                                            '{[values === this.termFirst ? " selected" : ""]}',
                                            '{[values.get("Left") >= this.termLast.get("Left") ? " disabled" : ""]}',
                                        '>',
                                            '{[values.get("Title")]}',
                                        '</option>',
                                    '</tpl>',
                                '</select>',
                                '<select name="term-last" class="field-control">',
                                    '<tpl for="this.terms">',
                                        '<option',
                                            ' value="{[values.getId()]}"',
                                            '{[values === this.termLast ? " selected" : ""]}',
                                            '{[values.get("Left") <= this.termFirst.get("Left") ? " disabled" : ""]}',
                                        '>',
                                            '{[values.get("Title")]}',
                                        '</option>',
                                    '</tpl>',
                                '</select>',
                            '</div>',
                        '</th>',
                        '<tpl for="terms">',
                            '<th class="{[baseCls]}-grid-group-header has-divider" colspan="4">{[values.get("Title")]}</th>',
                        '</tpl>',
                    '</tr>',

                    '<tr class="{[baseCls]}-rating-header-row">',
                        '<th class="{[baseCls]}-grid-blank-header">&nbsp;</th>',

                        '<th class="{[baseCls]}-grid-rating-header">Growth</th>',

                        '<th class="{[baseCls]}-grid-rating-header has-divider">',
                            '<abbr title="Not Meeting">NM</abbr>',
                        '</th>',
                        '<th class="{[baseCls]}-grid-rating-header">',
                            '<abbr title="Approaching">A</abbr>',
                        '</th>',
                        '<th class="{[baseCls]}-grid-rating-header">',
                            '<abbr title="Meeting">M</abbr>',
                        '</th>',
                        '<th class="{[baseCls]}-grid-rating-header">',
                            '<abbr title="Exceeding">E</abbr>',
                        '</th>',

                        '<tpl for="this.terms">',
                            '<th class="{[baseCls]}-grid-rating-header has-divider">',
                                '<abbr title="Not Meeting">NM</abbr>',
                            '</th>',
                            '<th class="{[baseCls]}-grid-rating-header">',
                                '<abbr title="Approaching">A</abbr>',
                            '</th>',
                            '<th class="{[baseCls]}-grid-rating-header">',
                                '<abbr title="Meeting">M</abbr>',
                            '</th>',
                            '<th class="{[baseCls]}-grid-rating-header">',
                                '<abbr title="Exceeding">E</abbr>',
                            '</th>',
                        '</tpl>',
                    '</tr>',

                '</thead>',


                '<tpl for="worksheets.getRange()">',
                    '<tbody class="{[baseCls]}-worksheet-body">',

                        '<tr class="{[baseCls]}-worksheet-row">',
                            '<th class="{[baseCls]}-worksheet-header" colspan="{[totalColumns]}">{[values.get("Title")]}</th>',
                        '</tr>',

                        '<tpl for="values.get(\'Prompts\')">',

                            '<tr class="{[baseCls]}-standard-row" data-prompt="{ID}">',
                                '<th class="{[baseCls]}-standard-header">{Prompt}</th>',
                                '<td class="{[baseCls]}-percent-cell">',
                                    '{% v = this.calculateGrowth(values.ID) %}',
                                    '{[v === null ? "&mdash;" : fm.number(v, "0.#")]}',
                                '</td>',

                                '{% this.currentDelta = this.calculateDelta(1, values.ID) %}',
                                '<td class="{[baseCls]}-percent-cell has-divider <tpl if="this.currentDelta &lt; 0">standards-grid-negative</tpl>">',
                                    '{[this.currentDelta === null ? "&mdash;" : (this.currentDelta > 0 ? "+" : "") + fm.number(this.currentDelta, "0.#")]}',
                                '</td>',
                                '{% this.currentDelta = this.calculateDelta(2, values.ID) %}',
                                '<td class="{[baseCls]}-percent-cell <tpl if="this.currentDelta &lt; 0">standards-grid-negative</tpl>">',
                                    '{[this.currentDelta === null ? "&mdash;" : (this.currentDelta > 0 ? "+" : "") + fm.number(this.currentDelta, "0.#")]}',
                                '</td>',
                                '{% this.currentDelta = this.calculateDelta(3, values.ID) %}',
                                '<td class="{[baseCls]}-percent-cell <tpl if="this.currentDelta &lt; 0">standards-grid-negative</tpl>">',
                                    '{[this.currentDelta === null ? "&mdash;" : (this.currentDelta > 0 ? "+" : "") + fm.number(this.currentDelta, "0.#")]}',
                                '</td>',
                                '{% this.currentDelta = this.calculateDelta(4, values.ID) %}',
                                '<td class="{[baseCls]}-percent-cell <tpl if="this.currentDelta &lt; 0">standards-grid-negative</tpl>">',
                                    '{[this.currentDelta === null ? "&mdash;" : (this.currentDelta > 0 ? "+" : "") + fm.number(this.currentDelta, "0.#")]}',
                                '</td>',

                                '<tpl for="this.terms">',
                                    '<td class="{[baseCls]}-percent-cell has-divider">',
                                        '{[this.countGrades(1, values.getId(), parent.ID)]}',
                                    '</td>',
                                    '<td class="{[baseCls]}-percent-cell">',
                                        '{[this.countGrades(2, values.getId(), parent.ID)]}',
                                    '</td>',
                                    '<td class="{[baseCls]}-percent-cell">',
                                        '{[this.countGrades(3, values.getId(), parent.ID)]}',
                                    '</td>',
                                    '<td class="{[baseCls]}-percent-cell">',
                                        '{[this.countGrades(4, values.getId(), parent.ID)]}',
                                    '</td>',
                                '</tpl>',
                            '</tr>',

                            '<tr class="{[baseCls]}-standard-row" data-prompt="{ID}">',
                                '<td class="{[baseCls]}-standard-row" colspan="{[totalColumns]}">',
                                    '<div class="{[baseCls]}-sections-ct">',
                                        '<table class="{[baseCls]}-sections-table">',
                                            '<colgroup class="{[baseCls]}-section-column">',
                                            '<colgroup class="{[baseCls]}-growth-column">',
                                            '<colgroup class="{[baseCls]}-delta-columns">',
                                                '<col class="{[baseCls]}-nm-column">',
                                                '<col class="{[baseCls]}-a-column">',
                                                '<col class="{[baseCls]}-m-column">',
                                                '<col class="{[baseCls]}-e-column">',
                                            '</colgroup>',
                                            '<tpl for="this.terms">',
                                                '<colgroup class="{[baseCls]}-q{[xindex]}-columns">',
                                                    '<col class="{[baseCls]}-nm-column">',
                                                    '<col class="{[baseCls]}-a-column">',
                                                    '<col class="{[baseCls]}-m-column">',
                                                    '<col class="{[baseCls]}-e-column">',
                                                '</colgroup>',
                                            '</tpl>',

                                            '<tpl for="parent.get(\'CourseSections\').getRange()">',
                                                '<tr class="{[baseCls]}-section-row" data-section="{[values.getId()]}">',
                                                    '<th class="{[baseCls]}-section-header">{[values.get("Code")]}</th>',
                                                    '<td class="{[baseCls]}-percent-cell">',
                                                        '{% v = this.calculateGrowth(parent.ID, values.getId()) %}',
                                                        '{[v === null ? "&mdash;" : fm.number(v, "0.#")]}',
                                                    '</td>',


                                                    '{% this.currentDelta = this.calculateDelta(1, parent.ID, values.getId()) %}',
                                                    '<td class="{[baseCls]}-percent-cell has-divider <tpl if="this.currentDelta &lt; 0">standards-grid-negative</tpl>">',
                                                        '{[this.currentDelta === null ? "&mdash;" : (this.currentDelta > 0 ? "+" : "") + fm.number(this.currentDelta, "0.#")]}',
                                                    '</td>',
                                                    '{% this.currentDelta = this.calculateDelta(2, parent.ID, values.getId()) %}',
                                                    '<td class="{[baseCls]}-percent-cell <tpl if="this.currentDelta &lt; 0">standards-grid-negative</tpl>">',
                                                        '{[this.currentDelta === null ? "&mdash;" : (this.currentDelta > 0 ? "+" : "") + fm.number(this.currentDelta, "0.#")]}',
                                                    '</td>',
                                                    '{% this.currentDelta = this.calculateDelta(3, parent.ID, values.getId()) %}',
                                                    '<td class="{[baseCls]}-percent-cell <tpl if="this.currentDelta &lt; 0">standards-grid-negative</tpl>">',
                                                        '{[this.currentDelta === null ? "&mdash;" : (this.currentDelta > 0 ? "+" : "") + fm.number(this.currentDelta, "0.#")]}',
                                                    '</td>',
                                                    '{% this.currentDelta = this.calculateDelta(4, parent.ID, values.getId()) %}',
                                                    '<td class="{[baseCls]}-percent-cell <tpl if="this.currentDelta &lt; 0">standards-grid-negative</tpl>">',
                                                        '{[this.currentDelta === null ? "&mdash;" : (this.currentDelta > 0 ? "+" : "") + fm.number(this.currentDelta, "0.#")]}',
                                                    '</td>',

                                                    '{% values.currentPromptId = parent.ID %}',
                                                    '<tpl for="this.terms">',
                                                        '<td class="{[baseCls]}-percent-cell has-divider">',
                                                            '{[this.countGrades(1, values.getId(), parent.currentPromptId, parent.getId())]}',
                                                        '</td>',
                                                        '<td class="{[baseCls]}-percent-cell">',
                                                            '{[this.countGrades(2, values.getId(), parent.currentPromptId, parent.getId())]}',
                                                        '</td>',
                                                        '<td class="{[baseCls]}-percent-cell">',
                                                            '{[this.countGrades(3, values.getId(), parent.currentPromptId, parent.getId())]}',
                                                        '</td>',
                                                        '<td class="{[baseCls]}-percent-cell">',
                                                            '{[this.countGrades(4, values.getId(), parent.currentPromptId, parent.getId())]}',
                                                        '</td>',
                                                    '</tpl>',
                                                '</tr>',
                                            '</tpl>',

                                        '</table>',
                                    '</div>',
                                '</td>',
                            '</tr>',

                        '</tpl>',

                    '</tbody>',
                '</tpl>',


            '</table>',
        '<div>',

        {
            countGrades: function(grade, term, prompt, section) {
                var reports = this.reports,
                    reportsCount = reports.getCount(),
                    i = 0,
                    count = 0,
                    report, grades;

                for (; i < reportsCount; i++) {
                    report = reports.getAt(i);
                    grades = (report.get('SbgWorksheet') || {}).grades;

                    if (
                        grades &&
                        (prompt in grades) &&
                        (!grade || grades[prompt] == grade) &&
                        report.get('TermID') == term &&
                        (!section || report.get('SectionID') == section)
                    ) {
                        count++;
                    }
                }

                return count;
            },
            calculateDelta: function(grade, prompt, section) {
                var me = this,
                    terms = me.terms,
                    termFirst = me.termFirst.getId(),
                    countFirst = me.countGrades(grade, termFirst, prompt, section),
                    totalFirst = me.countGrades(null, termFirst, prompt, section),
                    termLast = me.termLast.getId(),
                    countLast = me.countGrades(grade, termLast, prompt, section),
                    totalLast = me.countGrades(null, termLast, prompt, section);

                if (!totalFirst || !totalLast) {
                    return null;
                }

                if (me.changeUnit == 'percent') {
                    return ((countLast / totalLast) - (countFirst / totalFirst)) * 100;
                }

                return countLast - countFirst;
            },
            calculateGrowth: function(prompt, section) {
                var me = this,
                    termFirst = me.termFirst,
                    termLast = me.termLast,
                    terms = me.terms,
                    reports = me.reports, reportsCount = reports.getCount(), i,
                    report, reportGrades, promptGrade, studentId,
                    students = {}, student, term,
                    studentsTotal = 0, studentsGrown = 0,
                    first, last, firstGrade, lastGrade;


                // first loop: collect first+last grade for students
                for (i = 0; i < reportsCount; i++) {
                    report = reports.getAt(i);

                    if (section && report.get('SectionID') != section) {
                        continue;
                    }


                    reportGrades = (report.get('SbgWorksheet') || {}).grades;

                    if (
                        !reportGrades ||
                        !(promptGrade = reportGrades[prompt])
                    ) {
                        continue;
                    }


                    studentId = report.get('StudentID');
                    student = students[studentId] || (students[studentId] = {});
                    term = terms.getById(report.get('TermID'));

                    if (term === termFirst) {
                        student.first = {
                            grade: promptGrade
                        };
                    } else if (term === termLast) {
                        student.last = {
                            grade: promptGrade
                        };
                    }
                }

                // second loop: tally total students with 2 points (or with any points??) and ones with growth
                for (studentId in students) {
                    student = students[studentId];
                    first = student.first;
                    last = student.last;

                    if (!first || !last) {
                        continue;
                    }

                    firstGrade = first.grade;
                    lastGrade = last.grade;
                    studentsTotal++;

                    // count growth if student ended at level 3 or 4 or improved a level
                    if (
                        lastGrade == 3 ||
                        lastGrade== 4 ||
                        (
                            firstGrade && lastGrade &&
                            lastGrade > firstGrade
                        )
                    ) {
                        studentsGrown++;
                    }
                }

                if (!studentsTotal) {
                    return null;
                }

                return (studentsGrown / studentsTotal) * 100;
            }
        }
    ],


    constructor: function() {
        Ext.onReady(this.onDocReady, this);
    },

    onDocReady: function() {
        var me = this,
            standardsCt = me.standardsCt = Ext.getBody().down('#standardsCt'),
            siteEnv = window.SiteEnvironment || {},
            assignmentsStore, courseSectionsStore;


        // prepare container
        standardsCt.addCls(me.baseCls + '-ct').empty();


        // load stores
        me.term = Ext.create('Slate.model.Term', siteEnv.standardsTerm);

        me.worksheetsStore = Ext.create('Slate.sbg.store.StandardsWorksheets', {
            storeId: 'standards-worksheets',
            data: siteEnv.standardsWorksheets
        });

        me.termsStore = Ext.create('Slate.store.Terms', {
            storeId: 'standards-worksheet-terms',
            data: siteEnv.standardsWorksheetTerms
        });

        me.courseSectionsStore = courseSectionsStore = Ext.create('Slate.store.CourseSections', {
            storeId: 'standards-worksheet-course-sections',
            data: siteEnv.standardsWorksheetCourseSections
        });

        me.assignmentsStore = assignmentsStore = Ext.create('Slate.sbg.store.StandardsWorksheetAssignments', {
            storeId: 'standards-worksheet-assignments',
            data: siteEnv.standardsWorksheetAssignments
        });

        me.reportsStore = Ext.create('Slate.store.progress.SectionTermReports', {
            storeId: 'standards-reports',
            data: siteEnv.standardsReports
        });


        // compile cross-references
        me.worksheetsStore.each(function(worksheet) {
            var assignments = assignmentsStore.query('WorksheetID', worksheet.getId()),
                courseSectionIds = assignments.collect('CourseSectionID', 'data');

            worksheet.set('Assignments', assignments);
            worksheet.set('CourseSections', courseSectionsStore.queryBy(function(courseSection) {
                return Ext.Array.contains(courseSectionIds, courseSection.getId());
            }));
        });


        // initiate rendering
        me.renderTable();
    },

    renderTable: function() {
        var me = this,
            termsStore = me.termsStore,
            changeUnitSelect = me.standardsCt.down('select[name=change-unit]'),
            termFirstSelect = me.standardsCt.down('select[name=term-first]'),
            termLastSelect = me.standardsCt.down('select[name=term-last]');

        // remove change listeners attached to any select elements
        me.standardsCt.select('select', true).un('change', 'onTermChange', me);

        // overwrite container with template
        Ext.XTemplate.getTpl(me, 'tableTpl').overwrite(me.standardsCt, {
            baseCls: me.baseCls,
            terms: me.termsStore,
            courseSections: me.courseSectionsStore,
            worksheets: me.worksheetsStore,
            reports: me.reportsStore,
            changeUnit: changeUnitSelect ? changeUnitSelect.getValue() : 'percent',
            termFirst: termFirstSelect ? termsStore.getById(termFirstSelect.getValue()) : termsStore.first(),
            termLast: termLastSelect ? termsStore.getById(termLastSelect.getValue()) : termsStore.last()
        });

        // atach change listeners to select elements
        me.standardsCt.select('select', true).on('change', 'onTermChange', me);
    },

    onTermChange: function(ev, t) {
        this.renderTable();
    }
});