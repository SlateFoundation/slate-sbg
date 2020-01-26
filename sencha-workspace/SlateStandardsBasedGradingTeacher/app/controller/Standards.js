Ext.define('SlateStandardsBasedGradingTeacher.controller.Standards', {
    extend: 'Ext.app.Controller',
    requires: [

    ],

    views: [
        'Container',
        'Grid'
    ],

    stores: [
        'Terms',
        'ChildTerms',
        'ParentTerms',

        'CourseSections',
        'Teachers',
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
        'slate-standardsbasedgradingteacher-container slate-appheader combobox': {
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
            parentTermId = termCombo.getValue(),
            currentTeacher, loadedTeacher;

        if (!parentTermId) {
            teacherCombo.setDisabled(true);
            return;
        }

        if (combo === termCombo) {
            currentTeacher = teacherCombo.getSelectedRecord();
            teacherCombo.getStore().getProxy().setExtraParam('term', combo.getValue());
            teacherCombo.getStore().load(() => {
                teacherCombo.setDisabled(false);
                if (currentTeacher) {
                    loadedTeacher = teacherCombo.getStore().findRecord('ID', currentTeacher && currentTeacher.getId());

                    if (!loadedTeacher) {
                        teacherCombo.reset();
                    } else {
                        me.renderGrid();
                    }
                }
            });
            return;
        }

        me.renderGrid();
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

                    termFirst:
                        setDefaultTerms === false && firstTerm
                        ? termsStore.getAt(termsStore.findExact('ID', parseInt(firstTerm.value)))
                        : childTermsStore.first(),

                    termLast:
                        setDefaultTerms === false && lastTerm
                        ? termsStore.getAt(termsStore.findExact('ID', parseInt(lastTerm.value)))
                        : childTermsStore.last(),

                    changeUnit: changeUnit ? changeUnit.value : 'percent',
                    hide: !selectedTerm || !selectedTeacher
                });
                container.el.select('select', true).on('change', 'onSelectFieldChange', me);
            };

        if (grid) {
            container.el.select('select', true).un('change', 'onSelectFieldChange', me);

            if (
                selectedTeacher &&
                selectedTerm &&
                (
                    selectedTeacher != me.getTeacher() ||
                    selectedTerm != me.getTerm()
                )
            ) {
                me.setTerm(selectedTerm);
                me.setTeacher(selectedTeacher);
                container.setPlaceholderItem(false);

                me.loadStandardsWorksheetAssignments(() => {
                    _finishRender(true);
                });
            } else {
                if (!selectedTerm || !selectedTeacher) {
                    container.setPlaceholderItem(true);
                }
                _finishRender(false);
            }
        }

        return grid;
    },

    loadStandardsWorksheetAssignments: function(callback) {
        var me = this,
            grid = me.getStandardsGrid(),
            childTermsStore = me.getChildTermsStore(),
            courseSectionsStore = me.getCourseSectionsStore(),
            standardsWorksheetAssignmentsStore = me.getStandardsWorksheetAssignmentsStore(),
            standardsWorksheetsStore = me.getStandardsWorksheetsStore(),
            sectionTermReportsStore = me.getSectionTermReportsStore(),
            selectedTeacher = me.getTeacher(),
            selectedTerm = me.getTerm();

        grid.setLoading();

        standardsWorksheetAssignmentsStore.getProxy().setExtraParams({
            teacher: selectedTeacher.get('Username'),
            term: selectedTerm.get('Handle'),
            'include[]': [
                'CourseSection',
                'Worksheet.Prompts'
            ]
        });

        standardsWorksheetAssignmentsStore.load((records) => {
            const worksheetTermIds = new Set(),
                worksheets = new Map(),
                courseSections = new Map();

            for (const record of records) {
                worksheetTermIds.add(record.get('TermID'));
                worksheets.set(record.get('WorksheetID'), record.get('Worksheet'));
                courseSections.set(record.get('CourseSectionID'), record.get('CourseSection'));
            }

            childTermsStore.filter({
                id: 'available-terms',
                property: 'ID',
                operator: 'in',
                value: [...worksheetTermIds]
            });
            standardsWorksheetsStore.loadRawData([...worksheets.values()])
            courseSectionsStore.loadRawData([...courseSections.values()])

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
                'course_section[]': Array.from(courseSections.values(), courseSection => courseSection.Code)
            });

            sectionTermReportsStore.load(() => {
                grid.setLoading(false);
                Ext.callback(callback);
            });

        });
    }
});