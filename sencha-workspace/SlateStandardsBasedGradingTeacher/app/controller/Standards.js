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
        'MasterTerms',

        'SectionTermReports@Slate.store.progress',
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
            // standardsGrid: {
            //     selector: 'slate-standardsbasedgradingteacher-grid',
            //     autoCreate: true,

            //     xtype: 'slate-standardsbasedgradingteacher-grid'
            // },
            standardsGrid: 'slate-standardsbasedgradingteacher-container slate-standardsbasedgradingteacher-grid',
            termSelector: 'slate-standardsbasedgradingteacher-container combo[fieldLabel=Term]',
            teacherSelector: 'slate-standardsbasedgradingteacher-container combo[fieldLabel=Teacher]'
        },

        term: null,
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
            // me.prepareGrid();
            // me.renderGrid();
            // me.renderCt().render('standardsCt');
        });
    },

    onContainerComboChange: function(combo) {
        var me = this,
            termCombo = me.getTermSelector(),
            teacherCombo = me.getTeacherSelector(),
            parentTermId = termCombo.getValue();

        if (!parentTermId) {
            return;
        }

        if (combo === termCombo) {
            teacherCombo.getStore().getProxy().setExtraParam('term', termCombo.getValue());
            teacherCombo.getStore().load();
        } else if (combo === teacherCombo) {
            this.renderGrid();
        }
    },

    onSelectFieldChange: function() {
        this.renderGrid();
    },

    loadBootstrapData: function(callback) {
        var me = this,
            termsStore = me.getTermsStore();
            // reportsStore = me.getSectionTermReportsStore(),
            // assignmentsStore = me.getStandardsWorksheetAssignmentsStore(),
            // assignmentProxy = assignmentsStore.getProxy();


        termsStore.load(function() {
            Ext.callback(callback);
        });
        // assignmentProxy.setRelatedTable([
        //     'CourseSection',
        //     'Term',
        //     'Worksheet'
        // ]);

        // assignmentsStore.load(function(response) {
        //     var sections = response.data.related.Sections
        //         terms = response.data.related.Terms,
        //         worksheets = response.data.related.Worksheets;

        //     courseSectionsStore.setData(sections);
        //     termsStore.setData(terms);
        //     worksheetsStore.setData(worksheets);

        //     sectionIds = sections.map(s => s.ID);
        //     termIds = terms.map(t => t.ID);

        //     // loop "resopnse.terms, response.coursesections, response.worksheets for unique values"
        //     // load section term reports with TermIDs, SectionIDs filters
        //     reportsStore.setParams({
        //         'SectionID': sectionIds,
        //         'TermID': termIds
        //     }).load(function() {
        //         return Ext.callback(callback);
        //     });
        // });


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
        this.getStandardsCt().render('standardsCt');
    },

    renderGrid: function() {
        var me = this,
            grid = me.getStandardsGrid(),
            childTermsStore = me.getChildTermsStore(),
            termsStore = me.getChildTermsStore(),
            parentTerm = me.getTermSelector().getSelectedRecord(),
            firstTerm, lastTerm, changeUnit;

        if (grid) {
            // container.query('select', true).un('change', 'onSelectFieldChange', this);
            // firstTerm = grid.down('select[name=term-first]');
            // lastTerm = grid.down('select[name=term-last]');
            // changeUnit = grid.down('select[name=change-unit]');
            // todo: load all children terms via server
            childTermsStore.setData(
                me.getTermsStore().queryBy(
                    r => r.get('Left') > parentTerm.get('Left') && r.get('Right') < parentTerm.get('Right')
                )
            );
            debugger;

            grid.update({
                baseCls: me.getBaseCls(),
                terms: childTermsStore,
                courseSections: me.getCourseSectionsStore(),
                worksheets: me.getStandardsWorksheetsStore(),
                reports: me.getSectionTermReportsStore(),

                termFirst: firstTerm ? firstTerm.getValue() : termsStore.first(),
                termLast: lastTerm ? lastTerm.getValue() : termsStore.last(),
                changeUnit: changeUnit ? changeUnit.getValue() : 'percent'
            });
            // container.query('select', true).on('change', 'onSelectFieldChange', this);
        }
        return grid;
    }
});