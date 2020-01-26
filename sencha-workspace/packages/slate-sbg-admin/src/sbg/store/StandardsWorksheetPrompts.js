/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext,Slate*/
Ext.define('Slate.sbg.admin.store.StandardsWorksheetPrompts', {
    extend: 'Ext.data.Store',


    model: 'Slate.sbg.admin.model.StandardsWorksheetPrompt',

    config: {
        pageSize: false,
        autoSync: false,
        sorters: [{
            property: 'Position'
        }]
    }
});