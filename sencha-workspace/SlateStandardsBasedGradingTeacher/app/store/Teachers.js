Ext.define('SlateStandardsBasedGradingTeacher.store.Teachers', {
    extend: 'Slate.store.people.People',

    config: {
        proxy: {
            type: 'slate-people',
            url: '/sbg/teachers'
        }
    }
});