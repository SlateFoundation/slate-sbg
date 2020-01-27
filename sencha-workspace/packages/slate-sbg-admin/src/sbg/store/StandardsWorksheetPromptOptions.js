/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext*/
Ext.define('Slate.sbg.admin.store.StandardsWorksheetPromptOptions', {
    extend: 'Ext.data.Store',


    config: {
        fields: ['id', 'text'],
        data: [
            { id: 0, text: 'N/A' },
            { id: 1, text: '1' },
            { id: 2, text: '2' },
            { id: 3, text: '3' },
            { id: 4, text: '4' }
        ]
    }
});