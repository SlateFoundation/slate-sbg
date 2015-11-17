/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.sbg.model.StandardsWorksheetPrompt', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.identifier.Negative',
        'SlateAdmin.proxy.Records'
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
            defaultValue: 'Slate\\SBG\\WorksheetPrompt'
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
            name: 'WorksheetID',
            type: 'int'
        },
        {
            name: 'Position',
            type: 'int',
            defaultValue: 0
        },
        {
            name: 'Prompt',
            type: 'string'
        },
        {
            name: 'Status',
            type: 'string',
            defaultValue: 'published'
        }
    ],

    validators: {
        Prompt: 'presence'
    },

    proxy: {
        type: 'slaterecords',
        url: '/sbg/worksheet-prompts',
        limitParam: null,
        startParam: null
    }
});