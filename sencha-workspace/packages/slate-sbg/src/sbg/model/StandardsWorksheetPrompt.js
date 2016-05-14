/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.sbg.model.StandardsWorksheetPrompt', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.proxy.Records',
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
            defaultValue: 1
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
        type: 'slate-records',
        url: '/sbg/worksheet-prompts',
        limitParam: null,
        startParam: null
    }
});