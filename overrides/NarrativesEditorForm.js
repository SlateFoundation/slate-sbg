Ext.define('SlateSbg.overrides.SlateAdmin', {
    override: 'SlateAdmin.view.progress.narratives.EditorForm',
    requires: [
        'Ext.form.FieldSet',
        'Slate.sbg.widget.WorksheetPrompt'
    ],

    initComponent: function() {
        var me = this;

        me.items = Ext.Array.insert(Ext.Array.clone(me.items), 1,[{
            itemId: 'sbgPromptsFieldset',

            xtype: 'fieldset',
            title: 'Standards-based grading worksheet',
            defaultType: 'sbg-worksheets-prompt',
            hidden: true
            // collapsible: true,
            // stateful: true,
            // stateId: 'sbg-prompts-fieldset'
        }]);

        me.callParent(arguments);
    }
});