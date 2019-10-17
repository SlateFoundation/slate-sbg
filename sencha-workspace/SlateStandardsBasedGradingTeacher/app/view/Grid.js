Ext.define('SlateStandardsBasedGradingTeacher.view.Grid', {
    extend: 'Ext.Component',
    xtype: 'slate-standardsbasedgradingteacher-grid',

    renderTpl: [
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
                            '<th class="{[baseCls]}-grid-group-header has-divider" colspan="4" data-term="{[values.getId()]}">{[values.get("Title")]}</th>',
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

                        '{% this.currentSectionIds = values.get("CourseSections").collect("ID", "data") %}',

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

                                '{% this.currentDelta = this.calculateDelta(1, values.ID, this.currentSectionIds) %}',
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
                                        '{[this.countGrades(1, values.getId(), parent.ID, this.currentSectionIds)]}',
                                    '</td>',
                                    '<td class="{[baseCls]}-percent-cell">',
                                        '{[this.countGrades(2, values.getId(), parent.ID, this.currentSectionIds)]}',
                                    '</td>',
                                    '<td class="{[baseCls]}-percent-cell">',
                                        '{[this.countGrades(3, values.getId(), parent.ID, this.currentSectionIds)]}',
                                    '</td>',
                                    '<td class="{[baseCls]}-percent-cell">',
                                        '{[this.countGrades(4, values.getId(), parent.ID, this.currentSectionIds)]}',
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
            countGrades: function(grade, term, prompt, sections) {
                var reports = this.reports,
                    reportsCount = reports.getCount(),
                    i = 0,
                    count = 0,
                    report, grades;

                if (!Ext.isArray(sections)) {
                    sections = [sections];
                }

                for (; i < reportsCount; i++) {
                    report = reports.getAt(i);
                    grades = (report.get('SbgWorksheet') || {}).grades;

                    if (
                        grades &&
                        (prompt in grades) &&
                        (!grade || grades[prompt] == grade) &&
                        report.get('TermID') == term &&
                        Ext.Array.contains(sections, report.get('SectionID'))
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

    config: {
        baseCls: 'standards-grid',

        termsStore: null,
        sectionsStore: null,
        reportsStore: null,
        worksheetsStore: null,

        changeUnit: 'percent',
        termFirst: null,
        termLast: null
    },

    // initComponent: function() {
    //     var me = this;

    //     me.callParent(arguments);
    // }
});