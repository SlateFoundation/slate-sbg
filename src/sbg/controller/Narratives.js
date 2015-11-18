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
                load: 'onSectionsLoad',
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

    onSectionsLoad: function(sectionsStore) {
        var me = this,
            sectionsView = me.getSectionsGrid().getView(),
            assignmentsStore = me.getStandardsWorksheetAssignmentsStore();

        assignmentsStore.getProxy().setExtraParam('term', me.getTermSelector().getValue());

        sectionsView.setLoading('Loading SBG assignments&hellip;');

        assignmentsStore.load({
            callback: function(assignments) {
                var len = assignments.length,
                    i = 0, assignment, section;

                sectionsStore.beginUpdate();

                for (; i < len; i++) {
                    assignment = assignments[i];
                    section = sectionsStore.getById(assignment.get('CourseSectionID'));
                    section.set({
                        WorksheetID: assignment.get('WorksheetID'),
                        worksheetAssignment: assignment
                    }, { dirty: false });
                }

                sectionsStore.endUpdate();

                sectionsView.setLoading(false);

                // restore original loading text
                sectionsView.loadMask.msg = sectionsView.loadingText;
            }
        });
    },

    onSectionUpdate: function(sectionsStore, section, operation, modifiedFieldNames) {
        if (operation != 'edit' || modifiedFieldNames.indexOf('WorksheetID') == -1) {
            return;
        }

        var assignment = section.get('worksheetAssignment'),
            worksheetId = section.get('WorksheetID');

        if (assignment) {
            assignment.set('WorksheetID', worksheetId);
        } else {
            assignment = this.getStandardsWorksheetAssignmentsStore().add({
                TermID: this.getTermSelector().getSelection().getId(),
                CourseSectionID: section.getId(),
                WorksheetID: worksheetId
            })[0];
        }

        assignment.save({
            success: function() {
                section.set({
                    WorksheetID: worksheetId,
                    worksheetAssignment: assignment
                }, { dirty: false });
                section.commit();
            }
        });
    }
});