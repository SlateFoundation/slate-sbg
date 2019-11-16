Ext.define('SlateStandardsBasedGradingTeacher.store.MasterTerms', {
    extend: 'Ext.data.ChainedStore',
    requires: [
        'SlateStandardsBasedGradingTeacher.store.Terms'
    ],

    source: 'Terms',
    filters: [
        ({data: {ParentID}}) => ParentID === 0 || ParentID === null
    ]
});