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
        Ext.util.History.resumeState(false); // false to discard any changes to state

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
            Ext.Msg.confirm('Unsaved Changes', 'You have unsaved changes to this worksheet.<br/><br/>Do you want to continue without saving them?', function (btn) {
                if (btn != 'yes') {
                    return;
                }

                me.revertChanges();
                selModel.select([worksheet]);
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
        Ext.Msg.confirm(
            'Delete Worksheet',
            Ext.String.format(
                'Are you sure you want to delete the worksheet <strong>"{0}"</strong> and all of its prompts?',
                worksheet.get('Title')
            ),
            function (btn) {
                if (btn != 'yes') {
                    return;
                }

                worksheet.erase();
            }
        );
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

    onPromptDeleteClick: function(promptsGrid, prompt) {
        promptsGrid.getStore().remove(prompt);
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

        Ext.Msg.confirm('Discard Changes', 'Are you sure you want to discard all changes to this worksheet?', function (btn) {
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
            doSavePrompts = function() {
                var worksheetId = worksheet.getId();

                if (worksheetWasPhantom) {
                    promptsStore.each(function(prompt) {
                        prompt.set('WorksheetID', worksheetId);
                    });
                }

                promptsStore.sync({
                    callback: function(batch, options) {
                        managerCt.setLoading(false);
                    }
                });
            };

        form.updateRecord(worksheet);

        if (!worksheet.dirty && !me.isPromptsStoreDirty()) {
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

        return (
            promptsStore.getNewRecords().length ||
            promptsStore.getUpdatedRecords().length ||
            promptsStore.getRemovedRecords().length
        );
    }
});