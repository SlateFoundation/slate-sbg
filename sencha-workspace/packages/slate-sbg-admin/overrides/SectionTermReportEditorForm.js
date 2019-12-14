Ext.define('Slate.sbg.admin.overrides.SectionTermReportEditorForm', {
    override: 'SlateAdmin.view.progress.terms.EditorForm',
    requires: [
        'Ext.form.FieldSet',
        'Slate.sbg.admin.widget.WorksheetPrompt'
    ],

    initComponent: function() {
        var me = this;

        me.items = Ext.Array.insert(Ext.Array.clone(me.items), 1, [{
            itemId: 'sbgPromptsFieldset',

            xtype: 'fieldset',
            title: 'Standards-based grading worksheet',
            defaultType: 'sbg-worksheets-prompt',
            hidden: true
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

            if (promptComponent.isXType('sbg-worksheets-prompt')) {
                gradesData[promptComponent.getPrompt().getId()] = promptComponent.getGrade();
            }
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

            if (promptComponent.isXType('sbg-worksheets-prompt')) {
                promptComponent.setGrade(gradesData[promptComponent.getPrompt().getId()]);
            }
        }
    }
});