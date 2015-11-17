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
        clicksToEdit: 1
    }],

    hideHeaders: true,
    store: 'StandardsWorksheetPrompts',
    columns: [{
        text: 'Position',
        width: 40,
        dataIndex: 'Position'
    },{
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
        width: 50,
        items: [{
            action: 'up',
            glyph: 0xf062, // fa-arrow-up
            tooltip: 'Move prompt up'
        },{
            action: 'down',
            glyph: 0xf063, // fa-arrow-down
            tooltip: 'Move prompt down'
        },{
            action: 'delete',
            iconCls: 'prompt-delete glyph-danger',
            glyph: 0xf056, // fa-minus-circle
            tooltip: 'Delete prompt'
        }]
    }]
});