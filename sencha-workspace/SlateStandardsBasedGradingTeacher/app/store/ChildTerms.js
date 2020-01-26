Ext.define('SlateStandardsBasedGradingTeacher.store.ChildTerms', {
    extend: 'Ext.data.ChainedStore',

    source: 'Terms',
    sorters: [{
        property: 'Left',
        direction: 'DESC'
    }],
    filters: [{
        id: 'available-terms',
        property: 'ID',
        operator: 'in',
        value: []
    }],
});