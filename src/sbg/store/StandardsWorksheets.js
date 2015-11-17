/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext,Slate*/
Ext.define('Slate.sbg.store.StandardsWorksheets', {
    extend: 'Ext.data.Store',

    model: 'Slate.sbg.model.StandardsWorksheet',
    pageSize: false,
    autoSync: false
});