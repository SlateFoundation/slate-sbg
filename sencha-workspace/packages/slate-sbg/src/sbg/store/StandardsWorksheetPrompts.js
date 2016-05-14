/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext,Slate*/
Ext.define('Slate.sbg.store.StandardsWorksheetPrompts', {
    extend: 'Ext.data.Store',


    model: 'Slate.sbg.model.StandardsWorksheetPrompt',

    config: {
        pageSize: false,
        autoSync: false,
        sorters: [{
            property: 'Position'
        }]
    }
});