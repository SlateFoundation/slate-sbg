Ext.define('SlateStandardsBasedGradingTeacher.view.Container', {
    extend: 'Slate.ui.app.Container',
    xtype: 'slate-standardsbasedgradingteacher-container',
    requires: [
        'Ext.form.field.ComboBox',
        'Ext.layout.container.Column',
        'SlateStandardsBasedGradingTeacher.view.Grid',
        'SlateStandardsBasedGradingTeacher.store.Teachers',
        'SlateStandardsBasedGradingTeacher.store.ParentTerms'
    ],

    config: {
        fullWidth: true,
        header: {
            title: 'Standards Based Grading Teacher',

            items: [{
                xtype: 'combobox',
                fieldLabel: 'Term',
                store: 'ParentTerms',
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
                displayField: 'SortName',
                valueField: 'Username',
                allowBlank: false,
                editable: false,
                disabled: true,
                columnWidth: 0.5
            }]
        },
        placeholderItem: 'Select a section to load tasks dashboard'
    },

    items: [{
        xtype: 'slate-standardsbasedgradingteacher-grid',
        flex: 1
    }]
});