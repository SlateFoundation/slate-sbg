Ext.define('Slate.sbg.overrides.TermReportPrintContainer', {
    override: 'SlateAdmin.view.progress.terms.print.Container',


    config: {
        standardsWorksheetTitle: 'Standards Worksheet'
    },

    initComponent: function() {
        var me = this;

        me.callParent(arguments);

        me.down('fieldset#includeFieldset').add({
            boxLabel: me.getStandardsWorksheetTitle(),
            name: 'print[sbg_worksheet]',
            checked: true
        });
    }
});