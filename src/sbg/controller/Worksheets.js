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
        saveBtn: 'sbg-worksheets-form button#saveBtn',
        revertBtn: 'sbg-worksheets-form button#revertBtn'
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

        grid.getPlugin('cellediting').startEdit(worksheet, 0);
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
        var form = this.getForm();

        form.enable();
        form.loadRecord(worksheet);
    },

    onFieldDirtyChange: function(field, dirty) {
        this.syncFormButtons();
    },


    // controller methods
    syncFormButtons: function() {
        var me = this,
            form = me.getForm(),
            isDirty = form.isDirty();

        me.getRevertBtn().setDisabled(!isDirty);
        me.getSaveBtn().setDisabled(!isDirty || !form.isValid());
    }
});