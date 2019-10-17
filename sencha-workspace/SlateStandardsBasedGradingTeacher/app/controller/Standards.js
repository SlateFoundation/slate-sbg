Ext.define('SlateStandardsBasedGradingTeacher.controller.Standards', {
    extend: 'Ext.app.Controller',
    requires: [

    ],

    views: [
        'Container'
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
            standardsCt: {
                selector: 'slate-standardsbasedgradingteacher-container',
                autoCreate: true,

                xtype: 'slate-standardsbasedgradingteacher-container'
            },
            'standardsGrid': 'slate-standardsbasedgradingteacher-grid'
        }
    },

    control: {
        'slate-standardsbasedgradingteacher-conatiner select': {
            change: 'onSelectFieldChange'
        }
    },

    onLaunch: function() {
        this.renderContainer();
    },

    onSelectFieldChange: function() {
        this.renderGrid();
    },

    renderContainer: function() {
        var container = this.getStandardsCt();

        this.renderGrid();

        container.render('slateapp-viewport');
    },

    renderGrid: function() {
        var container = this.getStandardsCt(),
            grid = this.getStandardsGrid();

        if (grid) {
            container.select('select', true).un('change', 'onSelectFieldChange', this);
            grid.set({
                termsStore: me.getTermsStore(),
                worksheetsStore: me.getStandardsWorksheetsStore(),
                courseSectionsStore: me.getCourseSectionsStore(),
                assignmentsStore: me.getStandardsWorksheetAssignmentsStore(),

                // termFirstSelect: me.getFirstTermSelect().getValue(),
                // termLastSelect: me.getLastTermSelect().getValue()
            });
            container.select('select', true).on('change', 'onSelectFieldChange', this);
        }

    }
});