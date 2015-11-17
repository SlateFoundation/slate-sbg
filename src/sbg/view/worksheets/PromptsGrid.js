/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext,SlateAdmin*/
Ext.define('Slate.sbg.view.worksheets.PromptsGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'sbg-worksheets-promptsgrid',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.grid.column.Action'
    ],

    title: 'Prompts',
    componentCls: 'sbg-worksheets-promptsgrid',
    // tbar: [{
    //     xtype: 'button',
    //     text: 'Add Prompt',
    //     action: 'addPrompt'
    // }, {
    //     xtype: 'tbfill'
    // }, {
    //     xtype: 'button',
    //     text: 'Disable this worksheet',
    //     action: 'disableWorksheet'
    // }],
    plugins: [{
        ptype: 'cellediting',
        pluginId: 'cellediting',
        clicksToEdit: 2
    }],

    hideHeaders: true,
    store: 'StandardsWorksheetPrompts',
    columns: [{
        flex: 1,

        text: 'Prompt',
        dataIndex: 'Prompt',
        editor: {
            xtype: 'textfield',
            allowBlank: false,
            maxLength: 255,
            enforceMaxLength: true
        }
    },{
        xtype: 'actioncolumn',
        width: 30,
        items: [{
            action: 'delete',
            iconCls: 'prompt-delete glyph-danger',
            glyph: 0xf056, // fa-minus-circle
            tooltip: 'Delete prompt'
        }]
    }]
});