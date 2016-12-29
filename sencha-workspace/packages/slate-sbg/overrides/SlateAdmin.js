Ext.define('Slate.sbg.overrides.SlateAdmin', {
    override: 'SlateAdmin.Application',
    requires: [
        'Slate.sbg.controller.Worksheets',
        'Slate.sbg.controller.SectionTermReports'
    ],

    initControllers: function() {
        this.callParent();
        this.getController('Slate.sbg.controller.Worksheets');
        this.getController('Slate.sbg.controller.SectionTermReports');
    }
});