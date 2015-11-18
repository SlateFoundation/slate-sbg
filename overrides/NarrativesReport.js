Ext.define('Slate.sbg.overrides.NarrativesReport', {
    override: 'SlateAdmin.model.progress.narratives.Report',
}, function(Report) {
    Report.addFields([
        {
            name: 'SbgWorksheet'
        }
    ]);
});