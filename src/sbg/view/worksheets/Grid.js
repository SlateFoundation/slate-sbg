/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext,SlateAdmin*/
Ext.define('Slate.sbg.view.worksheets.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'sbg-worksheets-grid',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text'
    ],

    componentCls: 'sbg-worksheets-grid',
    bbar: [{
        flex: 1,
        itemId: 'createWorksheetBtn',

        xtype: 'button',
        text: 'Create Worksheet'
    }],
    plugins: [{
        ptype: 'cellediting',
        pluginId: 'cellediting',
        clicksToEdit: 2
    }],

    store: 'StandardsWorksheets',
    columns: [{
        flex: 1,

        text: 'Title',
        dataIndex: 'Title',
        editor: {
            xtype: 'textfield',
            allowBlank: false
        }
    }]
});