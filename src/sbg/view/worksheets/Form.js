/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext,SlateAdmin*/
Ext.define('Slate.sbg.view.worksheets.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'sbg-worksheets-form',
    requires: [
        'Ext.form.field.Display',
        'Ext.form.field.TextArea',
    //     'SlateAdmin.view.sbg.standards.worksheets.PromptsGrid'
    ],

    disabled: true,
    title: 'Selected Worksheet',
    componentCls: 'sbg-standards-worksheets-editor',
    bodyPadding: 10,

    defaults: {
        labelWidth: 70,
        labelAlign: 'right',
        anchor: '100%'
    },
    items: [{
        xtype: 'displayfield',
        name: 'Title',
        fieldLabel: 'Title'
    },{
        xtype: 'textareafield',
        name: 'Description',
        // enableKeyEvents: true,
        fieldLabel: 'Description',
        emptyText: 'Optional explanation of worksheet for parents and students',
        grow: true
    // },{
    //     xtype: 'sbg-standards-worksheets-promptsgrid',
    //     flex: 1
    }]
});