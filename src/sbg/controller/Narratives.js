Ext.define('Slate.sbg.controller.Narratives', {
    extend: 'Ext.app.Controller',


    config: {
        worksheet: null
    },

    // controller config
    stores: [
        'StandardsWorksheets@Slate.sbg.store',
        'StandardsWorksheetAssignments@Slate.sbg.store',
        'StandardsWorksheetPrompts@Slate.sbg.store'
    ],

    views: [
        'WorksheetPrompt@Slate.sbg.widget'
    ],

    refs: {
        sectionsGrid: 'progress-narratives-sectionsgrid',
        termSelector: 'progress-narratives-sectionsgrid #termSelector',
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
                beforereportsave: 'onBeforeReportSave'
            }
        }
    },


    // controller template methods
    onLaunch: function() {
        //debugger;
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
                        i = 0, prompt,
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

        assignment.save({
            success: function() {
                section.set({
                    WorksheetID: worksheetId,
                    worksheetAssignment: assignment
                }, { dirty: false });
                section.commit();

                me.setWorksheet(worksheetId);
            }
        });
    },

    onReportLoad: function(report) {
        var promptsFieldset = this.getPromptsFieldset(),
            promptComponents = promptsFieldset.items.getRange(),
            len = promptComponents.length,
            i = 0, promptComponent,
            worksheetData = report.get('SbgWorksheet'),
            gradesData = (worksheetData && worksheetData.worksheet_id == this.getWorksheet() && worksheetData.grades) || {};

        for (; i < len; i++) {
            promptComponent = promptComponents[i];

            promptComponent.setGrade(gradesData[promptComponent.getPrompt().getId()]);
        }
    },

    onBeforeReportSave: function(report) {
        var promptsFieldset = this.getPromptsFieldset(),
            promptComponents = promptsFieldset.items.getRange(),
            len = promptComponents.length,
            i = 0, promptComponent,
            worksheetData = {
                worksheet_id: this.getWorksheet(),
                grades: {}
            },
            gradesData = worksheetData.grades;

        for (; i < len; i++) {
            promptComponent = promptComponents[i];

            gradesData[promptComponent.getPrompt().getId()] = promptComponent.getGrade();
        }

        report.set('SbgWorksheet', worksheetData);
    }
});