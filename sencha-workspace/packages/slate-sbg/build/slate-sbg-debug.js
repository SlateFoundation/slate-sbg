/*jslint browser: true, undef: true, white: false, laxbreak: true */
/*global Ext,SlateAdmin*/
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
            store: 'StandardsWorksheetPromptOptions',
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
            combo, promptCmp, prompt, grade;
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

Ext.define('Slate.sbg.overrides.NarrativesEditorForm', {
    override: 'SlateAdmin.view.progress.narratives.EditorForm',
    requires: [
        'Ext.form.FieldSet',
        'Slate.sbg.widget.WorksheetPrompt'
    ],
    initComponent: function() {
        var me = this;
        me.items = Ext.Array.insert(Ext.Array.clone(me.items), 1, [
            {
                itemId: 'sbgPromptsFieldset',
                xtype: 'fieldset',
                title: 'Standards-based grading worksheet',
                defaultType: 'sbg-worksheets-prompt',
                hidden: true
            }
        ]);
        me.callParent(arguments);
        me.sbgPromptsFieldset = me.down('#sbgPromptsFieldset');
    },
    getSbgGrades: function() {
        var promptComponents = this.sbgPromptsFieldset.items.getRange(),
            len = promptComponents.length,
            i = 0,
            promptComponent,
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
            i = 0,
            promptComponent;
        gradesData = gradesData || {};
        for (; i < len; i++) {
            promptComponent = promptComponents[i];
            if (promptComponent.isXType('sbg-worksheets-prompt')) {
                promptComponent.setGrade(gradesData[promptComponent.getPrompt().getId()]);
            }
        }
    }
});

Ext.define('Slate.sbg.overrides.NarrativesReport', {
    override: 'SlateAdmin.model.progress.narratives.Report'
}, function(Report) {
    Report.addFields([
        {
            name: 'SbgWorksheet'
        }
    ]);
});

Ext.define('Slate.sbg.overrides.NarrativesSectionsGrid', {
    override: 'SlateAdmin.view.progress.narratives.SectionsGrid',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.ComboBox'
    ],
    width: 300,
    worksheetColumnTitle: 'Worksheet',
    emptyWorksheetText: '<em>Double-click to select</em>',
    initComponent: function() {
        var me = this;
        me.columns = me.columns.concat({
            text: me.worksheetColumnTitle,
            dataIndex: 'WorksheetID',
            emptyCellText: me.emptyWorksheetText,
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
                selectOnFocus: true
            },
            renderer: function(worksheetId, metaData, section) {
                if (!worksheetId) {
                    return null;
                }
                var worksheet = section.get('worksheet');
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

/*jslint browser: true, undef: true, white: false, laxbreak: true */
/*global Ext,Slate*/
Ext.define('Slate.sbg.model.StandardsWorksheet', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.validator.Presence',
        'Ext.data.identifier.Negative'
    ],
    idProperty: 'ID',
    identifier: 'negative',
    fields: [
        {
            name: 'ID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'Class',
            type: 'string',
            defaultValue: 'Slate\\SBG\\Worksheet'
        },
        {
            name: 'Created',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'CreatorID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'Title',
            type: 'string'
        },
        {
            name: 'Handle',
            type: 'string'
        },
        {
            name: 'Status',
            type: 'string',
            defaultValue: 'published'
        },
        {
            name: 'Description',
            type: 'string'
        }
    ],
    validators: {
        Title: 'presence'
    },
    proxy: {
        type: 'slaterecords',
        url: '/sbg/worksheets',
        limitParam: null,
        startParam: null
    }
});

/*jslint browser: true, undef: true, white: false, laxbreak: true */
/*global Ext,Slate*/
Ext.define('Slate.sbg.store.StandardsWorksheets', {
    extend: 'Ext.data.Store',
    model: 'Slate.sbg.model.StandardsWorksheet',
    pageSize: false,
    autoSync: false
});

/*jslint browser: true, undef: true */
/*global Ext*/
Ext.define('Slate.sbg.model.StandardsWorksheetPrompt', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.identifier.Negative'
    ],
    // model config
    idProperty: 'ID',
    identifier: 'negative',
    fields: [
        {
            name: 'ID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'Class',
            type: 'string',
            defaultValue: 'Slate\\SBG\\WorksheetPrompt'
        },
        {
            name: 'Created',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'CreatorID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'WorksheetID',
            type: 'int'
        },
        {
            name: 'Position',
            type: 'int',
            defaultValue: 1
        },
        {
            name: 'Prompt',
            type: 'string'
        },
        {
            name: 'Status',
            type: 'string',
            defaultValue: 'published'
        }
    ],
    validators: {
        Prompt: 'presence'
    },
    proxy: {
        type: 'slaterecords',
        url: '/sbg/worksheet-prompts',
        limitParam: null,
        startParam: null
    }
});

/*jslint browser: true, undef: true, white: false, laxbreak: true */
/*global Ext,Slate*/
Ext.define('Slate.sbg.store.StandardsWorksheetPrompts', {
    extend: 'Ext.data.Store',
    model: 'Slate.sbg.model.StandardsWorksheetPrompt',
    pageSize: false,
    autoSync: false,
    sorters: [
        {
            property: 'Position'
        }
    ]
});

/*jslint browser: true, undef: true, white: false, laxbreak: true */
/*global Ext,SlateAdmin*/
Ext.define('Slate.sbg.view.worksheets.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'sbg-worksheets-grid',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.grid.column.Action'
    ],
    title: 'Available Worksheets',
    componentCls: 'sbg-worksheets-grid',
    bbar: [
        {
            flex: 1,
            itemId: 'createWorksheetBtn',
            xtype: 'button',
            text: 'Create Worksheet',
            glyph: 61525
        }
    ],
    // fa-plus-circle
    hideHeaders: true,
    store: 'StandardsWorksheets',
    columns: [
        {
            flex: 1,
            text: 'Title',
            dataIndex: 'Title',
            emptyCellText: 'Untitled worksheet'
        },
        {
            xtype: 'actioncolumn',
            width: 20,
            items: [
                {
                    action: 'delete',
                    iconCls: 'prompt-delete glyph-danger',
                    glyph: 61526,
                    // fa-minus-circle
                    tooltip: 'Delete prompt'
                }
            ]
        }
    ]
});

/*jslint browser: true, undef: true, white: false, laxbreak: true */
/*global Ext,SlateAdmin*/
Ext.define('Slate.sbg.view.worksheets.PromptsGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'sbg-worksheets-promptsgrid',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.grid.column.Action'
    ],
    title: 'Prompts',
    componentCls: 'sbg-worksheets-promptsgrid',
    // tbar: [{
    //     xtype: 'button',
    //     text: 'Add Prompt',
    //     action: 'addPrompt'
    // }, {
    //     xtype: 'tbfill'
    // }, {
    //     xtype: 'button',
    //     text: 'Disable this worksheet',
    //     action: 'disableWorksheet'
    // }],
    plugins: [
        {
            ptype: 'cellediting',
            pluginId: 'cellediting',
            clicksToEdit: 1
        }
    ],
    hideHeaders: true,
    store: 'StandardsWorksheetPrompts',
    columns: [
        {
            text: 'Position',
            width: 40,
            dataIndex: 'Position'
        },
        {
            flex: 1,
            text: 'Prompt',
            dataIndex: 'Prompt',
            editor: {
                xtype: 'textfield',
                allowBlank: false,
                maxLength: 255,
                enforceMaxLength: true
            }
        },
        {
            xtype: 'actioncolumn',
            width: 50,
            items: [
                {
                    action: 'up',
                    glyph: 61538,
                    // fa-arrow-up
                    tooltip: 'Move prompt up'
                },
                {
                    action: 'down',
                    glyph: 61539,
                    // fa-arrow-down
                    tooltip: 'Move prompt down'
                },
                {
                    action: 'delete',
                    iconCls: 'prompt-delete glyph-danger',
                    glyph: 61526,
                    // fa-minus-circle
                    tooltip: 'Delete prompt'
                }
            ]
        }
    ]
});

/*jslint browser: true, undef: true, white: false, laxbreak: true */
/*global Ext,SlateAdmin*/
Ext.define('Slate.sbg.view.worksheets.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'sbg-worksheets-form',
    requires: [
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Slate.sbg.view.worksheets.PromptsGrid'
    ],
    disabled: true,
    title: 'Selected Worksheet',
    componentCls: 'sbg-standards-worksheets-editor',
    bodyPadding: 10,
    scrollable: 'vertical',
    trackResetOnLoad: true,
    defaults: {
        labelWidth: 70,
        labelAlign: 'right',
        anchor: '100%'
    },
    items: [
        {
            xtype: 'textfield',
            name: 'Title',
            fieldLabel: 'Title',
            allowBlank: false
        },
        {
            xtype: 'textareafield',
            name: 'Description',
            // enableKeyEvents: true,
            fieldLabel: 'Description',
            emptyText: 'Optional explanation of worksheet for parents and students',
            grow: true
        },
        {
            xtype: 'sbg-worksheets-promptsgrid'
        }
    ],
    buttons: [
        {
            itemId: 'revertBtn',
            text: 'Revert Changes',
            cls: 'glyph-danger',
            glyph: 61527
        },
        // fa-times-circle
        {
            xtype: 'tbfill'
        },
        {
            itemId: 'addPromptBtn',
            text: 'Add Prompt',
            glyph: 61525
        },
        // fa-plus-circle
        {
            itemId: 'saveBtn',
            text: 'Save Changes',
            cls: 'glyph-success',
            glyph: 61528
        }
    ]
});
// fa-check-circle

/*jslint browser: true, undef: true, white: false, laxbreak: true */
/*global Ext,SlateAdmin*/
Ext.define('Slate.sbg.view.worksheets.Manager', {
    extend: 'Ext.Container',
    xtype: 'sbg-worksheets-manager',
    requires: [
        'Slate.sbg.view.worksheets.Grid',
        'Slate.sbg.view.worksheets.Form'
    ],
    componentCls: 'sbg-worksheets-manager',
    layout: 'border',
    // worksheet: null,
    items: [
        {
            region: 'west',
            split: true,
            xtype: 'sbg-worksheets-grid',
            autoScroll: true,
            width: 500
        },
        {
            region: 'center',
            xtype: 'sbg-worksheets-form',
            flex: 1
        }
    ]
});
// //helper functions
// updateWorksheet: function(worksheet){
//     if(!worksheet) {
//         return false;
//     }
//     var editor = this.down('sbg-worksheets-editor'),
//         field = editor.down('textareafield[name=Description]');
//     field.removeCls('dirty').addCls('saved');
//     this.down('sbg-worksheets-editor').loadRecord(worksheet);
//     this.worksheet = worksheet;
// },
// getWorksheet: function(){
//     return this.worksheet;
// }

Ext.define('Slate.sbg.controller.Worksheets', {
    extend: 'Ext.app.Controller',
    // controller config
    routes: {
        'settings/standards-worksheets': 'showWorksheetSettings'
    },
    views: [
        'worksheets.Manager@Slate.sbg.view'
    ],
    stores: [
        'StandardsWorksheets@Slate.sbg.store',
        'StandardsWorksheetPrompts@Slate.sbg.store'
    ],
    refs: {
        settingsNavPanel: 'settings-navpanel',
        managerCt: {
            selector: 'sbg-worksheets-manager',
            autoCreate: true,
            xtype: 'sbg-worksheets-manager'
        },
        grid: 'sbg-worksheets-grid',
        form: 'sbg-worksheets-form',
        titleField: 'sbg-worksheets-form field[name=Title]',
        promptsGrid: 'sbg-worksheets-promptsgrid',
        revertBtn: 'sbg-worksheets-form button#revertBtn',
        saveBtn: 'sbg-worksheets-form button#saveBtn'
    },
    control: {
        managerCt: {
            activate: 'onManagerCtActivate'
        },
        'sbg-worksheets-manager button#createWorksheetBtn': {
            click: 'onCreateWorksheetBtnClick'
        },
        grid: {
            beforeselect: 'onGridBeforeSelect',
            select: 'onGridSelect',
            deleteclick: 'onWorksheetDeleteClick'
        },
        'sbg-worksheets-form field': {
            dirtychange: 'onFieldDirtyChange'
        },
        promptsGrid: {
            upclick: 'onPromptGridUpClick',
            downclick: 'onPromptGridDownClick',
            deleteclick: 'onPromptDeleteClick'
        },
        revertBtn: {
            click: 'onRevertBtnClick'
        },
        saveBtn: {
            click: 'onSaveBtnClick'
        },
        'sbg-worksheets-manager button#addPromptBtn': {
            click: 'onAddPromptBtnClick'
        }
    },
    listen: {
        store: {
            '#StandardsWorksheets': {
                update: 'onWorksheetUpdate'
            },
            '#StandardsWorksheetPrompts': {
                add: 'onWorksheetPromptAdd',
                update: 'onWorksheetPromptUpdate',
                remove: 'onWorksheetPromptRemove',
                write: 'onWorksheetPromptsStoreWrite'
            }
        }
    },
    // controller template methods
    init: function() {
        SlateAdmin.view.settings.NavPanel.prototype.config.data.push({
            href: '#settings/standards-worksheets',
            text: 'Standards Worksheets'
        });
    },
    onLaunch: function() {
        console.warn('SBG controller launched');
    },
    // route handlers
    showWorksheetSettings: function() {
        var me = this,
            navPanel = me.getSettingsNavPanel();
        Ext.suspendLayouts();
        Ext.util.History.suspendState();
        navPanel.setActiveLink('settings/standards-worksheets');
        navPanel.expand(false);
        Ext.util.History.resumeState(false);
        // false to discard any changes to state
        me.application.getController('Viewport').loadCard(me.getManagerCt());
        Ext.resumeLayouts(true);
    },
    // event handlers
    onManagerCtActivate: function() {
        this.getStandardsWorksheetsStore().load();
    },
    onCreateWorksheetBtnClick: function() {
        var grid = this.getGrid(),
            worksheet = grid.getStore().add({})[0];
        grid.setSelection(worksheet);
        this.getTitleField().focus();
    },
    onGridBeforeSelect: function(selModel, worksheet) {
        var me = this,
            form = me.getForm(),
            loadedWorksheet = form.getRecord();
        if (loadedWorksheet && (form.isDirty() || me.isPromptsStoreDirty())) {
            Ext.Msg.confirm('Unsaved Changes', 'You have unsaved changes to this worksheet.<br/><br/>Do you want to continue without saving them?', function(btn) {
                if (btn != 'yes') {
                    return;
                }
                me.revertChanges();
                selModel.select([
                    worksheet
                ]);
            });
            return false;
        }
    },
    onGridSelect: function(selModel, worksheet) {
        var me = this,
            form = me.getForm(),
            promptsStore = me.getStandardsWorksheetPromptsStore();
        form.enable();
        form.loadRecord(worksheet);
        if (worksheet.phantom) {
            promptsStore.loadRecords([]);
        } else {
            promptsStore.load({
                params: {
                    worksheet: worksheet.getId()
                }
            });
        }
        me.syncFormButtons();
    },
    onWorksheetDeleteClick: function(grid, worksheet) {
        Ext.Msg.confirm('Delete Worksheet', Ext.String.format('Are you sure you want to delete the worksheet <strong>"{0}"</strong> and all of its prompts?', worksheet.get('Title')), function(btn) {
            if (btn != 'yes') {
                return;
            }
            worksheet.erase();
        });
    },
    onFieldDirtyChange: function(field, dirty) {
        this.syncFormButtons();
    },
    onPromptGridUpClick: function(promptsGrid, prompt, item, rowIndex) {
        var promptsStore = promptsGrid.getStore(),
            previousPrompt = promptsStore.getAt(rowIndex - 1);
        if (!previousPrompt) {
            return;
        }
        promptsStore.beginUpdate();
        previousPrompt.set('Position', rowIndex + 1);
        prompt.set('Position', rowIndex);
        promptsStore.endUpdate();
    },
    onPromptGridDownClick: function(promptsGrid, prompt, item, rowIndex) {
        var promptsStore = promptsGrid.getStore(),
            nextPrompt = promptsStore.getAt(rowIndex + 1);
        if (!nextPrompt) {
            return;
        }
        promptsStore.beginUpdate();
        prompt.set('Position', rowIndex + 2);
        nextPrompt.set('Position', rowIndex + 1);
        promptsStore.endUpdate();
    },
    onPromptDeleteClick: function(promptsGrid, prompt, item, rowIndex) {
        var promptsStore = promptsGrid.getStore();
        promptsStore.remove(prompt);
        promptsStore.each(function(otherPrompt, otherRowIndex) {
            if (otherRowIndex >= rowIndex) {
                otherPrompt.set('Position', otherRowIndex + 1);
            }
        });
    },
    onWorksheetUpdate: function(worksheetsStore, worksheet, operation) {
        var form = this.getForm();
        // reload record into form after commit to server
        if (operation == 'commit' && form.getRecord() === worksheet) {
            form.loadRecord(worksheet);
        }
    },
    onWorksheetPromptAdd: function() {
        this.syncFormButtons();
    },
    onWorksheetPromptUpdate: function() {
        this.syncFormButtons();
    },
    onWorksheetPromptRemove: function() {
        this.syncFormButtons();
    },
    onWorksheetPromptsStoreWrite: function() {
        this.syncFormButtons();
    },
    onRevertBtnClick: function() {
        var me = this,
            grid = me.getGrid(),
            form = me.getForm(),
            worksheet = form.getRecord();
        Ext.Msg.confirm('Discard Changes', 'Are you sure you want to discard all changes to this worksheet?', function(btn) {
            if (btn != 'yes') {
                return;
            }
            me.revertChanges();
            if (worksheet.phantom) {
                form.disable();
                grid.getStore().remove(worksheet);
            }
        });
    },
    onSaveBtnClick: function() {
        var me = this,
            managerCt = me.getManagerCt(),
            form = me.getForm(),
            worksheet = form.getRecord(),
            worksheetWasPhantom = worksheet.phantom,
            promptsStore = me.getStandardsWorksheetPromptsStore(),
            isPromptsStoreDirty = me.isPromptsStoreDirty(),
            doSavePrompts = function() {
                var worksheetId = worksheet.getId();
                if (worksheetWasPhantom) {
                    promptsStore.each(function(prompt) {
                        prompt.set('WorksheetID', worksheetId);
                    });
                }
                if (isPromptsStoreDirty) {
                    promptsStore.sync({
                        callback: function(batch, options) {
                            managerCt.setLoading(false);
                        }
                    });
                } else {
                    managerCt.setLoading(false);
                }
            };
        form.updateRecord(worksheet);
        if (!worksheet.dirty && !isPromptsStoreDirty) {
            return;
        }
        managerCt.setLoading('Saving worksheet&hellip;');
        if (worksheet.dirty) {
            worksheet.save({
                callback: function(report, operation, success) {
                    if (success) {
                        doSavePrompts();
                    } else {
                        managerCt.setLoading(false);
                        Ext.Msg.alert('Failed to save worksheet', 'This worksheet failed to save to the server:<br><br>' + (operation.getError() || 'Unknown reason, try again or contact support'));
                    }
                }
            });
        } else {
            doSavePrompts();
        }
    },
    onAddPromptBtnClick: function() {
        var promptsGrid = this.getPromptsGrid(),
            promptsStore = promptsGrid.getStore(),
            prompt = promptsStore.add({
                WorksheetID: this.getForm().getRecord().getId(),
                Position: promptsStore.getCount() + 1
            })[0];
        promptsGrid.getPlugin('cellediting').startEdit(prompt, 1);
    },
    // controller methods
    syncFormButtons: function() {
        var me = this,
            form = me.getForm(),
            formDirty = form.isDirty(),
            promptsDirty = me.isPromptsStoreDirty();
        me.getRevertBtn().setDisabled(!formDirty && !form.getRecord().phantom && !promptsDirty);
        me.getSaveBtn().setDisabled((!formDirty && !promptsDirty) || !form.isValid() || !me.isPromptsStoreValid());
    },
    revertChanges: function() {
        this.getForm().reset();
        this.getStandardsWorksheetPromptsStore().rejectChanges();
    },
    isPromptsStoreValid: function() {
        var isValid = true;
        this.getStandardsWorksheetPromptsStore().each(function(prompt) {
            if (!prompt.isValid()) {
                isValid = false;
                return false;
            }
        });
        return isValid;
    },
    isPromptsStoreDirty: function() {
        var promptsStore = this.getStandardsWorksheetPromptsStore();
        return (promptsStore.getNewRecords().length || promptsStore.getUpdatedRecords().length || promptsStore.getRemovedRecords().length);
    }
});

/*jslint browser: true, undef: true */
/*global Ext*/
Ext.define('Slate.sbg.model.StandardsWorksheetAssignment', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.identifier.Negative'
    ],
    // model config
    idProperty: 'ID',
    identifier: 'negative',
    fields: [
        {
            name: 'ID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'Class',
            type: 'string',
            defaultValue: 'Slate\\SBG\\WorksheetAssignment'
        },
        {
            name: 'Created',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'CreatorID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'TermID',
            type: 'int'
        },
        {
            name: 'CourseSectionID',
            type: 'int'
        },
        {
            name: 'WorksheetID',
            type: 'int',
            allowNull: true
        }
    ],
    proxy: {
        type: 'slaterecords',
        url: '/sbg/worksheet-assignments',
        limitParam: null,
        startParam: null
    }
});

/*jslint browser: true, undef: true, white: false, laxbreak: true */
/*global Ext,Slate*/
Ext.define('Slate.sbg.store.StandardsWorksheetAssignments', {
    extend: 'Ext.data.Store',
    model: 'Slate.sbg.model.StandardsWorksheetAssignment',
    pageSize: false,
    autoSync: false
});

/*jslint browser: true, undef: true, white: false, laxbreak: true */
/*global Ext*/
Ext.define('Slate.sbg.store.StandardsWorksheetPromptOptions', {
    extend: 'Ext.data.Store',
    config: {
        fields: [
            'id',
            'text'
        ],
        data: [
            {
                id: 0,
                text: 'N/A'
            },
            {
                id: 1,
                text: '1'
            },
            {
                id: 2,
                text: '2'
            },
            {
                id: 3,
                text: '3'
            },
            {
                id: 4,
                text: '4'
            }
        ]
    }
});

/* global Ext */
Ext.define('Slate.sbg.controller.Narratives', {
    extend: 'Ext.app.Controller',
    config: {
        worksheet: null
    },
    // controller config
    stores: [
        'StandardsWorksheets@Slate.sbg.store',
        'StandardsWorksheetAssignments@Slate.sbg.store',
        'StandardsWorksheetPrompts@Slate.sbg.store',
        'StandardsWorksheetPromptOptions@Slate.sbg.store'
    ],
    views: [
        'WorksheetPrompt@Slate.sbg.widget'
    ],
    refs: {
        sectionsGrid: 'progress-narratives-sectionsgrid',
        termSelector: 'progress-narratives-sectionsgrid #termSelector',
        editorForm: 'progress-narratives-editorform',
        promptsFieldset: 'progress-narratives-editorform #sbgPromptsFieldset'
    },
    control: {
        sectionsGrid: {
            boxready: 'onSectionsGridBoxReady',
            select: 'onSectionsGridSelect'
        }
    },
    listen: {
        store: {
            '#progress.narratives.Sections': {
                load: 'onSectionsLoad',
                update: 'onSectionUpdate'
            }
        },
        controller: {
            '#progress.Narratives': {
                reportload: 'onReportLoad',
                beforereportsave: 'onBeforeReportSave',
                reportsave: 'onReportSave'
            }
        }
    },
    // config handlers
    updateWorksheet: function(worksheetId) {
        var me = this,
            promptsFieldset = me.getPromptsFieldset(),
            promptsStore = me.getStandardsWorksheetPromptsStore();
        promptsFieldset.hide();
        if (worksheetId) {
            promptsStore.getProxy().setExtraParam('worksheet', worksheetId);
            promptsStore.load({
                callback: function(prompts) {
                    var len = prompts.length,
                        i = 0,
                        prompt,
                        promptComponents = [];
                    for (; i < len; i++) {
                        prompt = prompts[i];
                        promptComponents.push({
                            prompt: prompt
                        });
                    }
                    if (!promptComponents.length) {
                        promptComponents.push({
                            xtype: 'component',
                            html: 'Selected worksheet contains no prompts'
                        });
                    }
                    Ext.suspendLayouts();
                    promptsFieldset.removeAll();
                    promptsFieldset.add(promptComponents);
                    promptsFieldset.show();
                    Ext.resumeLayouts(true);
                }
            });
        } else {
            promptsStore.loadRecords([]);
        }
    },
    // event handlers
    onSectionsGridBoxReady: function(sectionsGrid) {
        var worksheetsStore = this.getStandardsWorksheetsStore();
        this.setWorksheet(null);
        if (!worksheetsStore.isLoaded()) {
            worksheetsStore.load();
        }
    },
    onSectionsGridSelect: function(sectionsGrid, section) {
        this.setWorksheet(section.get('WorksheetID'));
    },
    onSectionsLoad: function(sectionsStore) {
        var me = this,
            sectionsView = me.getSectionsGrid().getView(),
            worksheetsStore = me.getStandardsWorksheetsStore(),
            assignmentsStore = me.getStandardsWorksheetAssignmentsStore(),
            finishLoadAssignments = function() {
                var assignments = assignmentsStore.getRange(),
                    len = assignments.length,
                    i = 0,
                    assignment, worksheetId, section;
                sectionsStore.beginUpdate();
                for (; i < len; i++) {
                    assignment = assignments[i];
                    worksheetId = assignment.get('WorksheetID');
                    if (section = sectionsStore.getById(assignment.get('CourseSectionID'))) {
                        section.set({
                            WorksheetID: worksheetId,
                            worksheet: worksheetsStore.getById(worksheetId),
                            worksheetAssignment: assignment
                        }, {
                            dirty: false
                        });
                    }
                }
                sectionsStore.endUpdate();
                sectionsView.setLoading(false);
                // restore original loading text
                sectionsView.loadMask.msg = sectionsView.loadingText;
            };
        assignmentsStore.getProxy().setExtraParams(sectionsStore.getProxy().getExtraParams());
        sectionsView.setLoading('Loading SBG assignments&hellip;');
        assignmentsStore.load({
            callback: function() {
                if (worksheetsStore.isLoading()) {
                    worksheetsStore.on('load', finishLoadAssignments, me, {
                        single: true
                    });
                } else {
                    finishLoadAssignments();
                }
            }
        });
    },
    onSectionUpdate: function(sectionsStore, section, operation, modifiedFieldNames) {
        if (operation != 'edit' || modifiedFieldNames.indexOf('WorksheetID') == -1) {
            return;
        }
        var me = this,
            assignment = section.get('worksheetAssignment'),
            worksheetId = section.get('WorksheetID');
        if (assignment) {
            assignment.set('WorksheetID', worksheetId);
        } else {
            assignment = me.getStandardsWorksheetAssignmentsStore().add({
                TermID: me.getTermSelector().getSelection().getId(),
                CourseSectionID: section.getId(),
                WorksheetID: worksheetId
            })[0];
        }
        if (!assignment.dirty) {
            return;
        }
        assignment.save({
            success: function() {
                section.set({
                    WorksheetID: worksheetId,
                    worksheet: me.getStandardsWorksheetsStore().getById(worksheetId),
                    worksheetAssignment: assignment
                }, {
                    dirty: false
                });
                section.commit();
                me.setWorksheet(worksheetId);
            }
        });
    },
    onReportLoad: function(report) {
        var worksheetData = report.get('SbgWorksheet');
        this.getEditorForm().setSbgGrades(worksheetData && worksheetData.worksheet_id == this.getWorksheet() && worksheetData.grades);
    },
    onBeforeReportSave: function(report) {
        report.set('SbgWorksheet', {
            worksheet_id: this.getWorksheet(),
            grades: this.getEditorForm().getSbgGrades()
        });
    },
    onReportSave: function(report) {
        var worksheetData = report.get('SbgWorksheet');
        this.getEditorForm().setSbgGrades(worksheetData && worksheetData.worksheet_id == this.getWorksheet() && worksheetData.grades);
    }
});

Ext.define('Slate.sbg.overrides.SlateAdmin', {
    override: 'SlateAdmin.Application',
    requires: [
        'Slate.sbg.controller.Worksheets',
        'Slate.sbg.controller.Narratives'
    ],
    initControllers: function() {
        this.callParent();
        this.getController('Slate.sbg.controller.Worksheets');
        this.getController('Slate.sbg.controller.Narratives');
    }
});

