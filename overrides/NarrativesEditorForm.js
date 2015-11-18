Ext.define('Slate.sbg.overrides.NarrativesEditorForm', {
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

        me.sbgPromptsFieldset = me.down('#sbgPromptsFieldset');
    },

    getSbgGrades: function() {
        var promptComponents = this.sbgPromptsFieldset.items.getRange(),
            len = promptComponents.length,
            i = 0, promptComponent,
            gradesData = {};

        for (; i < len; i++) {
            promptComponent = promptComponents[i];

            gradesData[promptComponent.getPrompt().getId()] = promptComponent.getGrade();
        }

        return gradesData;
    },

    setSbgGrades: function(gradesData) {
        var promptComponents = this.sbgPromptsFieldset.items.getRange(),
            len = promptComponents.length,
            i = 0, promptComponent;

        gradesData = gradesData || {};

        for (; i < len; i++) {
            promptComponent = promptComponents[i];

            promptComponent.setGrade(gradesData[promptComponent.getPrompt().getId()]);
        }
    }
});