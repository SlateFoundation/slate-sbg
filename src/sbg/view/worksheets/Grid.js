/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext,SlateAdmin*/
Ext.define('Slate.sbg.view.worksheets.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'sbg-worksheets-grid',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text'
    ],

    title: 'Available Worksheets',
    componentCls: 'sbg-worksheets-grid',
    bbar: [{
        flex: 1,
        itemId: 'createWorksheetBtn',

        xtype: 'button',
        text: 'Create Worksheet',
        glyph: 0xf055 // fa-plus-circle
    }],
    plugins: [{
        ptype: 'cellediting',
        pluginId: 'cellediting',
        clicksToEdit: 2
    }],

    hideHeaders: true,
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