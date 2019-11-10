Ext.define('SlateStandardsBasedGradingTeacher.view.Container', {
    extend: 'Ext.container.Container',
    xtype: 'slate-standardsbasedgradingteacher-container',
    requires: [
        'Ext.form.field.ComboBox',
        'SlateStandardsBasedGradingTeacher.view.Grid',
        'SlateStandardsBasedGradingTeacher.store.Teachers',
        'SlateStandardsBasedGradingTeacher.store.MasterTerms'
    ],

    // layout: 'fit',

    items: [{
        xtype: 'combobox',
        fieldLabel: 'Term',
        store: 'MasterTerms',
        displayField: 'Title',
        valueField: 'Handle',
        allowBlank: false,
        editable: false,
        queryMode: 'local'
    },{
        xtype: 'combobox',
        fieldLabel: 'Teacher',
        store: 'Teachers',
        displayField: 'FullName',
        valueField: 'ID',
        allowBlank: false,
        editable: false
    },{
        xtype: 'slate-standardsbasedgradingteacher-grid'
    }]
});