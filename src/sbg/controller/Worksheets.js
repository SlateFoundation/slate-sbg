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
            select: 'onGridSelect'
        },
        'sbg-worksheets-form field': {
            dirtychange: 'onFieldDirtyChange'
        },
        promptsGrid: {
            upclick: 'onPromptGridUpClick',
            downclick: 'onPromptGridDownClick'
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
                update: 'onWorksheetPromptUpdate'
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

        if (loadedWorksheet && form.isDirty()) {
            Ext.Msg.confirm('Unsaved Changes', 'You have unsaved changes to this worksheet.<br/><br/>Do you want to continue without saving them?', function (btn) {
                if (btn != 'yes') {
                    return;
                }

                form.reset();
                selModel.select([worksheet]);
            });

            return false;
        }
    },

    onGridSelect: function(selModel, worksheet) {
        var form = this.getForm(),
            promptsStore = this.getStandardsWorksheetPromptsStore();

        promptsStore.removeAll();
        form.enable();
        form.loadRecord(worksheet);

        if (!worksheet.phantom) {
            promptsStore.load({
                params: {
                    worksheet: worksheet.getId()
                }
            });
        }
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

    onRevertBtnClick: function() {
        var grid = this.getGrid(),
            form = this.getForm(),
            worksheet = form.getRecord();

        Ext.Msg.confirm('Discard Changes', 'Are you sure you want to discard all changes to this worksheet?', function (btn) {
            if (btn != 'yes') {
                return;
            }

            form.reset();

            if (worksheet.phantom) {
                form.disable();
                grid.getStore().remove(worksheet);
            }

            // TODO: revert prompts store
        });
    },

    onSaveBtnClick: function() {
        var me = this,
            managerCt = me.getManagerCt(),
            form = me.getForm(),
            worksheet = form.getRecord(),
            promptsStore = me.getStandardsWorksheetPromptsStore();

        form.updateRecord(worksheet);

        if (!worksheet.dirty) {
            return;
        }

        managerCt.setLoading('Saving worksheet&hellip;');
        worksheet.save({
            callback: function(report, operation, success) {
                managerCt.setLoading(false);

                if (!success) {
                    Ext.Msg.alert('Failed to save worksheet', 'This worksheet failed to save to the server:<br><br>' + (operation.getError() || 'Unknown reason, try again or contact support'));
                }
            }
        });
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
            promptsStore = me.getStandardsWorksheetPromptsStore(),
            isDirty = form.isDirty(),
            promptInvalid = false,
            promptDirty = false;

        promptsStore.each(function(prompt) {
            if (!prompt.isValid()) {
                promptInvalid = true;
            }

            if (prompt.dirty) {
                promptDirty = true;
            }
        });

        me.getRevertBtn().setDisabled(!isDirty && !form.getRecord().phantom && !promptDirty);
        me.getSaveBtn().setDisabled((!isDirty && !promptDirty) || !form.isValid() || promptInvalid );
    }
});