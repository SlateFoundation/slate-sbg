Ext.define('SlateStandardsBasedGradingTeacher.store.ChildTerms', {
    extend: 'Ext.data.ChainedStore',

    source: 'Terms',
    sorters: [{
        property: 'Left',
        direction: 'ASC'
    }],
    filters: [{
        id: 'available-terms',
        property: 'ID',
        operator: 'in',
        value: []
    }],
});