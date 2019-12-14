/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext,Slate*/
Ext.define('Slate.sbg.model.StandardsWorksheet', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.proxy.Records',
        'Ext.data.validator.Presence',
        'Ext.data.identifier.Negative'
    ],


    // model config
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
            defaultValue: 'published'
        },
        {
            name: 'Description',
            type: 'string'
        }
    ],

    validators: {
        Title: 'presence'
    },

    proxy: {
        type: 'slate-records',
        url: '/sbg/worksheets',
        limitParam: null,
        startParam: null
    }
});