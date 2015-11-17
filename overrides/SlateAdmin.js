Ext.define('SlateSbg.overrides.SlateAdmin', {
    override: 'SlateAdmin.Application',
    requires: [
        'Slate.sbg.controller.Worksheets'
    ],

    initControllers: function() {
        this.callParent();
        this.getController('Slate.sbg.controller.Worksheets');
    }
});