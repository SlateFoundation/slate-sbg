Ext.define('SlateSbg.overrides.SlateAdmin', {
    override: 'SlateAdmin.Application',
    requires: [
        'Slate.sbg.controller.Worksheets',
        'Slate.sbg.controller.Narratives'
    ],

    initControllers: function() {
        this.callParent();
        this.getController('Slate.sbg.controller.Worksheets');
        this.getController('Slate.sbg.controller.Narratives');
    }
});