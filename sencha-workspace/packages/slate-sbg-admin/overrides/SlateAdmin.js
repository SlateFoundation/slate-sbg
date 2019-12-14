Ext.define('Slate.sbg.admin.overrides.SlateAdmin', {
    override: 'SlateAdmin.Application',
    requires: [
        'Slate.sbg.admin.controller.Worksheets',
        'Slate.sbg.admin.controller.SectionTermReports'
    ],

    initControllers: function() {
        this.callParent();
        this.getController('Slate.sbg.admin.controller.Worksheets');
        this.getController('Slate.sbg.admin.controller.SectionTermReports');
    }
});