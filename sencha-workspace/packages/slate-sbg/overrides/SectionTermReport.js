Ext.define('Slate.sbg.overrides.SectionTermReport', {
    override: 'Slate.model.progress.SectionTermReport'
}, function(Report) {
    Report.addFields([
        {
            name: 'SbgWorksheet',
            convert: function(v) {
                return typeof v == 'string' ? Ext.decode(v, true) || null : v;
            }
        }
    ]);
});