Ext.define('Slate.sbg.overrides.TermReport', {
    override: 'Slate.model.TermReport',
}, function(Report) {
    Report.addFields([
        {
            name: 'SbgWorksheet',
            convert: function(v) {
                debugger;
                return typeof v == 'string' ? Ext.decode(v, true) || null : v;
            }
        }
    ]);
});