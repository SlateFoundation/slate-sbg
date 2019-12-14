/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext,SlateAdmin*/
Ext.define('Slate.sbg.widget.WorksheetPrompt', {
    extend: 'Ext.container.Container',
    xtype: 'sbg-worksheets-prompt',
    requires: [
        'Ext.form.field.ComboBox'
    ],

    config: {
        prompt: null,
        grade: null
    },

    layout: 'hbox',
    items: [
        {
            xtype: 'combobox',
            width: 60,

            submitValue: false,
            store: {xclass: 'Slate.sbg.store.StandardsWorksheetPromptOptions'},
            valueField: 'id',
            displayField: 'text',
            queryMode: 'local',
            forceSelection: true,
            autoSelect: true,
            matchFieldWidth: false
        },
        {
            itemId: 'promptCmp',
            flex: 1,

            xtype: 'component',
            tpl: '{Prompt}'
        }
    ],

    initComponent: function() {
        var me = this,
            combo, promptCmp,
            prompt, grade;

        me.callParent(arguments);

        combo = me.combo = me.down('combobox');
        promptCmp = me.promptCmp = me.down('#promptCmp');

        if (prompt = me.getPrompt()) {
            promptCmp.update(prompt.getData());
        }

        combo.setValue(grade || null);
    },

    getGrade: function() {
        return this.combo ? this.combo.getValue() : this.callParent();
    },

    setGrade: function(grade) {
        var combo = this.combo;

        if (combo) {
            combo.setValue(grade);
            combo.resetOriginalValue();
        }
    }
});
