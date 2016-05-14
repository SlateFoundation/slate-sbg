/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext,Slate*/
Ext.define('Slate.sbg.store.StandardsWorksheetAssignments', {
    extend: 'Ext.data.Store',


    model: 'Slate.sbg.model.StandardsWorksheetAssignment',

    config: {
        pageSize: false,
        autoSync: false
    }
});