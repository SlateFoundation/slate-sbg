/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.sbg.model.StandardsWorksheetAssignment', {
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
            defaultValue: 'Slate\\SBG\\WorksheetAssignment'
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
            name: 'TermID',
            type: 'int'
        },
        {
            name: 'CourseSectionID',
            type: 'int'
        },
        {
            name: 'WorksheetID',
            type: 'int',
            allowNull: true
        }
    ],

    proxy: {
        type: 'slate-records',
        url: '/sbg/worksheet-assignments',
        limitParam: null,
        startParam: null
    }
});