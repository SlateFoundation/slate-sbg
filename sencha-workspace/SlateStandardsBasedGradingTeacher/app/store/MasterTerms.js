Ext.define('SlateStandardsBasedGradingTeacher.store.MasterTerms', {
    extend: 'Ext.data.ChainedStore',
    requires: [
        'SlateStandardsBasedGradingTeacher.store.Terms'
    ],

    source: 'Terms',
    filters: [
        term => term.data.ParentID === 0 || term.data.ParentID === null
    ]
});