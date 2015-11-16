Ext.define('SlateSbg.overrides.SlateAdmin', {
    override: 'SlateAdmin.Application',
    requires: [
        'Slate.sbg.Controller'
    ],

    initControllers: function() {
        this.callParent();
        this.getController('Slate.sbg.Controller');
    }
});