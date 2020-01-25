/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext,SlateAdmin*/
Ext.define('Slate.sbg.admin.view.worksheets.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'sbg-worksheets-grid',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.grid.column.Action'
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

    hideHeaders: true,
    store: 'StandardsWorksheets',
    columns: [{
        flex: 1,

        text: 'Title',
        dataIndex: 'Title',
        emptyCellText: 'Untitled worksheet'
    },{
        xtype: 'actioncolumn',
        width: 35, // n*15+20
        align: 'end',
        items: [{
            action: 'delete',
            iconCls: 'prompt-delete glyph-danger',
            glyph: 0xf056, // fa-minus-circle
            tooltip: 'Delete prompt'
        }]
    }]
});