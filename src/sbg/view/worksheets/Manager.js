/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext,SlateAdmin*/
Ext.define('Slate.sbg.view.worksheets.Manager', {
    extend: 'Ext.Container',
    xtype: 'sbg-worksheets-manager',
    requires: [
        'Slate.sbg.view.worksheets.Grid',
        'Slate.sbg.view.worksheets.Form'
    ],


    componentCls: 'sbg-worksheets-manager',
    layout: 'border',
    // worksheet: null,
    items: [{
        region: 'west',
        split: true,
        xtype: 'sbg-worksheets-grid',
        autoScroll: true,
        width: 500
    },{
        region: 'center',
        xtype: 'sbg-worksheets-form',
        flex: 1
    }],


    // //helper functions
    // updateWorksheet: function(worksheet){
    //     if(!worksheet) {
    //         return false;
    //     }

    //     var editor = this.down('sbg-worksheets-editor'),
    //         field = editor.down('textareafield[name=Description]');

    //     field.removeCls('dirty').addCls('saved');

    //     this.down('sbg-worksheets-editor').loadRecord(worksheet);

    //     this.worksheet = worksheet;
    // },
    // getWorksheet: function(){
    //     return this.worksheet;
    // }
});