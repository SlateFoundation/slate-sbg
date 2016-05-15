Ext.define('Slate.sbg.overrides.TermReport', {
    override: 'Slate.model.TermReport'
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