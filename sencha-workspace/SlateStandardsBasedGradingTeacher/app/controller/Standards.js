Ext.define('SlateStandardsBasedGradingTeacher.controller.Standards', {
    extend: 'Ext.app.Controller',
    requires: [

    ],

    views: [
        'Container',
        'Grid'
    ],

    stores: [
        'ChildTerms',
        'CourseSections',
        'Teachers',
        'Terms',
        'ParentTerms',
        'SectionTermReports',

        'StandardsWorksheets@Slate.sbg.store',
        'StandardsWorksheetAssignments@Slate.sbg.store'
    ],

    models: [
        'Term@Slate.model'
    ],

    config: {
        refs: {
            standardsCt: {
                selector: 'slate-standardsbasedgradingteacher-container',
                autoCreate: true,

                xtype: 'slate-standardsbasedgradingteacher-container'
            },
            standardsGrid: 'slate-standardsbasedgradingteacher-container slate-standardsbasedgradingteacher-grid',
            termSelector: 'slate-standardsbasedgradingteacher-container combo[fieldLabel=Term]',
            teacherSelector: 'slate-standardsbasedgradingteacher-container combo[fieldLabel=Teacher]'
        },

        term: null,
        teacher: null,

        baseCls: 'standards-grid'
    },

    control: {
        // 'slate-standardsbasedgradingteacher-container select': {
        //     change: 'onSelectFieldChange'
        // }
        'slate-standardsbasedgradingteacher-container combobox': {
            change: 'onContainerComboChange'
        }
    },

    onLaunch: function() {
        var me = this;

        me.loadBootstrapData(function() {
            me.renderCt();
        });
    },

    onContainerComboChange: function(combo) {
        var me = this,
            termCombo = me.getTermSelector(),
            teacherCombo = me.getTeacherSelector(),
            parentTermId = termCombo.getValue();

        if (!parentTermId) {
            teacherCombo.setDisabled(true);
            return;
        }

        if (combo === termCombo) {
            teacherCombo.getStore().getProxy().setExtraParam('term', combo.getValue());
            teacherCombo.getStore().load(() => teacherCombo.setDisabled(false));
        }

        if (termCombo.getValue() && teacherCombo.getValue()) {
            me.renderGrid();
        }
    },

    onSelectFieldChange: function() {
        this.renderGrid();
    },

    loadBootstrapData: function(callback) {
        var me = this,
            termsStore = me.getTermsStore();

        termsStore.load(function() {
            Ext.callback(callback);
        });
    },

    prepareGrid: function() {
        var me = this,
            standardsCt = me.standardsCt = Ext.getBody().down('#standardsCt');

        standardsCt.addCls(me.getBaseCls() + '-ct').empty();
        this.loadSiteEnvironmentData();
    },

    loadSiteEnvironmentData: function() {
        var me = this,
            siteEnv = window.SiteEnvironment || {},
            termsStore = me.getTermsStore(),
            worksheetsStore = me.getStandardsWorksheetsStore(),
            courseSectionsStore = me.getCourseSectionsStore(),
            assignmentsStore = me.getStandardsWorksheetAssignmentsStore(),
            reportsStore = me.getSectionTermReportsStore();

        me.setTerm(Ext.create('Slate.model.Term', siteEnv.standardsTerm));
        termsStore.setData(siteEnv.standardsWorksheetTerms);
        worksheetsStore.setData(siteEnv.standardsWorksheets);
        courseSectionsStore.setData(siteEnv.standardsWorksheetCourseSections);
        assignmentsStore.setData(siteEnv.standardsWorksheetAssignments);
        reportsStore.setData(siteEnv.standardsReports);

        // compile cross-references
        worksheetsStore.each(function(worksheet) {
            var assignments = assignmentsStore.query('WorksheetID', worksheet.getId()),
                courseSectionIds = assignments.collect('CourseSectionID', 'data');

            worksheet.set('Assignments', assignments);
            worksheet.set('CourseSections', courseSectionsStore.queryBy(function(courseSection) {
                return Ext.Array.contains(courseSectionIds, courseSection.getId());
            }));
        });

    },

    renderCt: function() {
        var container = this.getStandardsCt(),
            containerEl = Ext.get('standardsCt');

        containerEl.empty();
        container.render(containerEl);
    },

    renderGrid: function() {
        var me = this,
            container = me.getStandardsCt(),
            grid = me.getStandardsGrid(),

            courseSectionsStore = me.getCourseSectionsStore(),
            standardsWorksheetsStore = me.getStandardsWorksheetsStore(),
            sectionTermReportsStore = me.getSectionTermReportsStore(),
            termsStore = me.getTermsStore(),
            childTermsStore = me.getChildTermsStore(),

            selectedTerm = me.getTermSelector().getSelectedRecord(),
            selectedTeacher = me.getTeacherSelector().getSelectedRecord(),

            changeUnit = grid.el.selectNode('select[name=change-unit]', true),
            firstTerm = grid.el.selectNode('select[name=term-first]', true),
            lastTerm = grid.el.selectNode('select[name=term-last]', true),

            _finishRender = (setDefaultTerms) => {
                grid.update({
                    baseCls: me.getBaseCls(),
                    terms: childTermsStore,
                    courseSections: courseSectionsStore,
                    worksheets: standardsWorksheetsStore,
                    reports: sectionTermReportsStore,

                    termFirst: setDefaultTerms === false && firstTerm ? termsStore.findRecord('ID', firstTerm.value) : childTermsStore.first(),
                    termLast: setDefaultTerms === false && lastTerm ? termsStore.findRecord('ID', lastTerm.value) :  childTermsStore.last(),
                    changeUnit: changeUnit ? changeUnit.value : 'percent'
                });
                container.el.select('select', true).on('change', 'onSelectFieldChange', me);
            };


        if (grid) {
            container.el.select('select', true).un('change', 'onSelectFieldChange', me);

            if (
                (!me.getTeacher() || selectedTeacher.getId() != me.getTeacher().getId()) ||
                (!me.getTerm() || selectedTerm.getId() != me.getTerm().getId())
            ) {
                me.loadStandardsWorksheetAssignments(() => {
                    _finishRender(true);
                });
            } else {
                _finishRender(false);
            }
        }

        return grid;
    },

    loadStandardsWorksheetAssignments: function(callback) {
        var me = this,
            childTermsStore = me.getChildTermsStore(),
            courseSectionsStore = me.getCourseSectionsStore(),
            standardsWorksheetAssignmentsStore = me.getStandardsWorksheetAssignmentsStore(),
            standardsWorksheetsStore = me.getStandardsWorksheetsStore(),
            sectionTermReportsStore = me.getSectionTermReportsStore(),

            selectedTeacher = me.getTeacherSelector().getSelectedRecord(),
            selectedTerm = me.getTermSelector().getSelectedRecord();

        me.setTerm(selectedTerm);
        me.setTeacher(selectedTeacher);

        standardsWorksheetAssignmentsStore.getProxy().setExtraParams({
            teacher: selectedTeacher.get('Username'),
            term: selectedTerm.get('Handle'),
            'include[]': [
                'CourseSection',
                'Worksheet.Prompts'
            ]
        });

        standardsWorksheetAssignmentsStore.load((records) => {
            let worksheetTermIds = [],
                worksheets = [],
                courseSections = [],
                i = 0;

            for (; i < records.length; i++) {
                if (worksheetTermIds.indexOf(records[i].get('TermID')) === -1) {
                    worksheetTermIds.push(records[i].get('TermID'));
                }

                if (records[i].get('WorksheetID') && worksheets.find(w => w.ID === records[i].get('WorksheetID')) === undefined) {
                    worksheets.push(records[i].get('Worksheet'));
                }

                if (!courseSections.find(cs => cs.ID === records[i].get('CourseSectionID'))) {
                    courseSections.push(records[i].get('CourseSection'));
                }

            }

            childTermsStore.clearData();
            childTermsStore.setData(
                me.getTermsStore().queryBy(
                    r => worksheetTermIds.indexOf(r.getId()) !== -1
                )
            );

            standardsWorksheetsStore.clearData();
            standardsWorksheetsStore.setData(worksheets);

            courseSectionsStore.clearData();
            courseSectionsStore.setData(courseSections);

            // compile cross-references
            standardsWorksheetsStore.each(worksheet => {
                let assignments = standardsWorksheetAssignmentsStore.query('WorksheetID', worksheet.getId()),
                    courseSectionIds = assignments.collect('CourseSectionID', 'data');

                worksheet.set('Assignments', assignments);
                worksheet.set('CourseSections', courseSectionsStore.queryBy(courseSection => {
                    return Ext.Array.contains(courseSectionIds, courseSection.getId());
                }));
            });


            sectionTermReportsStore.getProxy().setExtraParams({
                'term': selectedTerm.get('Handle'),
                'course_section[]': courseSections.map(cs => cs.Code)
            });

            sectionTermReportsStore.load(() => {
                Ext.callback(callback);
            });

        });
    }
});