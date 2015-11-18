Ext.define('Slate.sbg.controller.Narratives', {
    extend: 'Ext.app.Controller',


    // controller config
    stores: [
        'StandardsWorksheets@Slate.sbg.store',
        'StandardsWorksheetAssignments@Slate.sbg.store'
    ],

    refs: {
        sectionsGrid: 'progress-narratives-sectionsgrid',
        termSelector: 'progress-narratives-sectionsgrid #termSelector'
    },

    control: {
        sectionsGrid: {
            boxready: 'onSectionsGridBoxReady'
        }
    },

    listen: {
        store: {
            '#progress.narratives.Sections': {
                update: 'onSectionUpdate'
            }
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
    },

    onSectionUpdate: function(sectionsStore, section, operation, modifiedFieldNames) {
        if (operation != 'edit' || modifiedFieldNames.indexOf('WorksheetID') == -1) {
            return;
        }

        var worksheetAssignment = section.get('worksheetAssignment'),
            worksheetId = section.get('WorksheetID');

        if (worksheetAssignment) {
            worksheetAssignment.set('WorksheetID', worksheetId);
        } else {
            worksheetAssignment = this.getStandardsWorksheetAssignmentsStore().add({
                TermID: this.getTermSelector().getSelection().getId(),
                CourseSectionID: section.getId(),
                WorksheetID: worksheetId
            })[0];
        }

        worksheetAssignment.save({
            success: function() {
                section.set({
                    WorksheetID: worksheetId,
                    worksheetAssignment: worksheetAssignment
                }, { dirty: false });
                section.commit();
            }
        });
    }
});