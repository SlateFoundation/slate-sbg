Ext.define('Slate.sbg.controller.Narratives', {
    extend: 'Ext.app.Controller',


    // controller config
    stores: [
        'StandardsWorksheets@Slate.sbg.store'
    ],

    refs: {
        sectionsGrid: 'progress-narratives-sectionsgrid'
    },

    control: {
        sectionsGrid: {
            boxready: 'onSectionsGridBoxReady'
        }
    },


    // controller template methods
    onLaunch: function() {
        //debugger;
    },


    // event handlers
    onSectionsGridBoxReady: function(sectionsGrid) {
        var worksheetsStore = this.getStandardsWorksheetsStore();

        if (!worksheetsStore.isLoaded()) {
            worksheetsStore.load();
        }
    }
});