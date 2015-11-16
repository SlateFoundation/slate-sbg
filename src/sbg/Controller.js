Ext.define('Slate.sbg.Controller', {
    extend: 'Ext.app.Controller',


    // controller config
    routes: {
        'settings/standards-worksheets': 'showWorksheetSettings'
    },

    views: [
        'worksheets.Manager@Slate.sbg.view'
    ],

    refs: {
        settingsNavPanel: 'settings-navpanel',
        manager: {
            selector: 'sbg-worksheets-manager',
            autoCreate: true,

            xtype: 'sbg-worksheets-manager'
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

        me.application.getController('Viewport').loadCard(me.getManager());

        Ext.resumeLayouts(true);
    }
});