Ext.define('SlateSbg.overrides.SlateAdmin', {
    override: 'SlateAdmin.view.progress.narratives.SectionsGrid',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.ComboBox'
    ],

    width: 300,

    initComponent: function() {
        var me = this;

        me.columns = me.columns.concat({
            text: 'Worksheet',
            dataIndex: 'WorksheetID',
            emptyCellText: '[Double-click to enable SBG]',
            width: 200,
            editor: {
                xtype: 'combo',
                allowBlank: true,
                emptyText: 'Select worksheet',

                store: 'StandardsWorksheets',
                displayField: 'Title',
                valueField: 'ID',

                queryMode: 'local',
                triggerAction: 'all',
                typeAhead: true,
                forceSelection: true,
                selectOnFocus: true,
            },
            renderer: function(worksheetId, metaData, section) {
                if (!worksheetId) {
                    return null;
                }

                var worksheet = Ext.getStore('StandardsWorksheets').getById(worksheetId);

                if (!worksheet) {
                    return '[Deleted Worksheet]';
                }

                return worksheet.get('Title');
            }
        });

        me.plugins = (me.plugins || []).concat({
            ptype: 'cellediting',
            clicksToEdit: 2
        });

        me.callParent(arguments);
    }
});