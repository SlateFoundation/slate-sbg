Ext.define('SlateStandardsBasedGradingTeacher.controller.Standards', {
    extend: 'Ext.app.Controller',
    requires: [

    ],

    views: [
        'Grid'
    ],

    stores: [
        'CourseSections',
        'Terms',

        'SectionTermReports@Slate.store.progress',
        'StandardsWorksheets@Slate.sbg.store',
        'StandardsWorksheetAssignments@Slate.sbg.store'
    ],

    models: [
        'Term@Slate.model'
    ],

    config: {
        refs: {
            standardsGrid: {
                selector: 'slate-standardsbasedgradingteacher-grid',
                autoCreate: true,

                xtype: 'slate-standardsbasedgradingteacher-grid'
            }
        },

        term: null,
        baseCls: 'standards-grid'
    },

    control: {
        'slate-standardsbasedgradingteacher-conatiner select': {
            change: 'onSelectFieldChange'
        }
    },

    onLaunch: function() {
        // this.renderContainer();
        this.prepareGrid();
        this.renderGrid().render('standardsCt');
    },

    onSelectFieldChange: function() {
        this.renderGrid();
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

    renderGrid: function() {
        var me = this,
            grid = me.getStandardsGrid(),
            termsStore = me.getTermsStore(),
            firstTerm, lastTerm, changeUnit;

        if (grid) {
            // container.query('select', true).un('change', 'onSelectFieldChange', this);
            // firstTerm = grid.down('select[name=term-first]');
            // lastTerm = grid.down('select[name=term-last]');
            // changeUnit = grid.down('select[name=change-unit]');

            grid.update({
                baseCls: me.getBaseCls(),
                terms: termsStore,
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