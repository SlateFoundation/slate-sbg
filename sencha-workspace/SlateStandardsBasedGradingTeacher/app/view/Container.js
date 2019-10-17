Ext.define('SlateStandardsBasedGradingTeacher.view.Container', {
    extend: 'Ext.container.Container',
    requires: [
        'SlateStandardsBasedGradingTeacher.view.Grid'
    ],

    layout: 'fit',

    items: [{
        xtype: 'slate-standardsbasedgradingteacher-grid'
    }]
});