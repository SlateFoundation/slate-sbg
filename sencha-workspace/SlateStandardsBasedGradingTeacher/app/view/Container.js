Ext.define('SlateStandardsBasedGradingTeacher.view.Container', {
    extend: 'Ext.container.Container',
    xtype: 'slate-standardsbasedgradingteacher-container',
    requires: [
        'Ext.form.field.ComboBox',
        'Ext.layout.container.Column',
        'SlateStandardsBasedGradingTeacher.view.Grid',
        'SlateStandardsBasedGradingTeacher.store.Teachers',
        'SlateStandardsBasedGradingTeacher.store.MasterTerms'
    ],

    items: [{
        xtype: 'container',
        layout: 'column',

        items: [{
            xtype: 'combobox',
            fieldLabel: 'Term',
            store: 'MasterTerms',
            displayField: 'Title',
            valueField: 'Handle',
            allowBlank: false,
            editable: false,
            queryMode: 'local',
            columnWidth: 0.5
        },{
            xtype: 'combobox',
            fieldLabel: 'Teacher',
            store: 'Teachers',
            displayField: 'FullName',
            valueField: 'Username',
            allowBlank: false,
            editable: false,
            disabled: true,
            columnWidth: 0.5
        }]
    },{
        xtype: 'slate-standardsbasedgradingteacher-grid',
        flex: 1
    }]
});