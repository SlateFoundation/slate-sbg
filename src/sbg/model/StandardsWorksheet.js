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
            type: 'int',
            allowNull: true
        },
        {
            name: 'Class',
            type: 'string',
            defaultValue: 'Slate\\SBG\\Worksheet'
        },
        {
            name: 'Created',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'CreatorID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'Title',
            type: 'string'
        },
        {
            name: 'Handle',
            type: 'string'
        },
        {
            name: 'Status',
            type: 'string',
            defaultValue: 'Live'
        },
        {
            name: 'Description',
            type: 'string',
            allowNull: true
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