Ext.define('SlateStandardsBasedGradingTeacher.store.SectionTermReports', {
    extend: 'Slate.store.progress.SectionTermReports',
    requires: [
        'Slate.proxy.progress.SectionTermReports'
    ],

    proxy: {
        type: 'slate-progress-reports-section-term'
    }
});