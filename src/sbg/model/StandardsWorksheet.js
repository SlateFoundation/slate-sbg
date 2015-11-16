/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext,Slate*/
Ext.define('Slate.sbg.model.StandardsWorksheet', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.validator.Presence',
        'Ext.data.identifier.Negative',
        'SlateAdmin.proxy.Records'
    ],

    idProperty: 'ID',
    identifier: 'negative',

    fields: [
        {
            name: 'ID',
            type: 'integer',
            useNull: true
        },
        {
            name: 'Created',
            type: 'date',
            dateFormat: 'timestamp',
            useNull: true
        },
        {
            name: 'CreatorID',
            type: 'integer',
            useNull: true
        },
        'Title',
        'Handle',
        'Description',
        'Status',
        {
            name: 'TotalPrompts',
            type: 'integer'
        }
    ],
    validators: {
        Title: 'presence'
    },
    proxy: {
        type: 'slaterecords',
        url: '/sbg/worksheets',
        include: ['TotalPrompts'],
        limitParam: null,
        startParam: null
    }
});