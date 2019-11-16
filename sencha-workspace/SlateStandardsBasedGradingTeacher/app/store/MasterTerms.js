Ext.define('SlateStandardsBasedGradingTeacher.store.MasterTerms', {
    extend: 'Ext.data.ChainedStore',
    requires: [
        'SlateStandardsBasedGradingTeacher.store.Terms'
    ],

    source: 'Terms',
    filters: [
        term => {
            console.log(term);
            return term.data.ParentID === 0
        }
    ]
});