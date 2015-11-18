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
            dataIndex: 'worksheet',
            emptyCellText: 'Click to enable SBG',
            width: 200,
            editor: {
                xtype: 'combo',
                allowBlank: false,
                emptyText: 'Select worksheet',

                store: 'StandardsWorksheets',
                displayField: 'Title',
                valueField: 'ID',

                queryMode: 'local',
                triggerAction: 'all',
                typeAhead: true,
                forceSelection: true,
                selectOnFocus: true,
            }
        });

        me.plugins = (me.plugins || []).concat({
            ptype: 'cellediting',
            clicksToEdit: 1
        });

        me.callParent(arguments);
    }
});