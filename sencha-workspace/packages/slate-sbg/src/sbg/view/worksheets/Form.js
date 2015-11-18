/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext,SlateAdmin*/
Ext.define('Slate.sbg.view.worksheets.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'sbg-worksheets-form',
    requires: [
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Slate.sbg.view.worksheets.PromptsGrid'
    ],

    disabled: true,
    title: 'Selected Worksheet',
    componentCls: 'sbg-standards-worksheets-editor',
    bodyPadding: 10,
    scrollable: 'vertical',

    trackResetOnLoad: true,

    defaults: {
        labelWidth: 70,
        labelAlign: 'right',
        anchor: '100%'
    },
    items: [{
        xtype: 'textfield',
        name: 'Title',
        fieldLabel: 'Title',
        allowBlank: false
    },{
        xtype: 'textareafield',
        name: 'Description',
        // enableKeyEvents: true,
        fieldLabel: 'Description',
        emptyText: 'Optional explanation of worksheet for parents and students',
        grow: true
    },{
        xtype: 'sbg-worksheets-promptsgrid'
    }],

    buttons: [{
        itemId: 'revertBtn',

        text: 'Revert Changes',
        cls: 'glyph-danger',
        glyph: 0xf057 // fa-times-circle
    },{
        xtype: 'tbfill'
    },{
        itemId: 'addPromptBtn',

        text: 'Add Prompt',
        glyph: 0xf055, // fa-plus-circle
    },{
        itemId: 'saveBtn',

        text: 'Save Changes',
        cls: 'glyph-success',
        glyph: 0xf058 // fa-check-circle
    }]
});