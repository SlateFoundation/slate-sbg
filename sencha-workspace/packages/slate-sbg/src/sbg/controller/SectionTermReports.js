/* global Ext */
Ext.define('Slate.sbg.controller.SectionTermReports', {
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
        sectionsGrid: 'progress-terms-sectionsgrid',
        termSelector: 'progress-terms-sectionsgrid #termSelector',
        editorForm: 'progress-terms-editorform',
        promptsFieldset: 'progress-terms-editorform #sbgPromptsFieldset'
    },

    control: {
        sectionsGrid: {
            boxready: 'onSectionsGridBoxReady',
            select: 'onSectionsGridSelect'
        }
    },

    listen: {
        store: {
            '#progress.terms.Sections': {
                load: 'onSectionsLoad',
                update: 'onSectionUpdate'
            }
        },
        controller: {
            '#progress.terms.Report': {
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
                    i = 0, assignment, worksheetId, section;

                sectionsStore.beginUpdate();

                for (; i < len; i++) {
                    assignment = assignments[i];
                    worksheetId = assignment.get('WorksheetID');

                    if (section = sectionsStore.getById(assignment.get('CourseSectionID'))) {
                        section.set({
                            WorksheetID: worksheetId,
                            worksheet: worksheetsStore.getById(worksheetId),
                            worksheetAssignment: assignment
                        }, { dirty: false });
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
                    worksheetsStore.on('load', finishLoadAssignments, me, { single: true });
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

        if (!assignment.dirty && !assignment.phantom) {
            return;
        }

        assignment.save({
            success: function() {
                section.set({
                    WorksheetID: worksheetId,
                    worksheet: me.getStandardsWorksheetsStore().getById(worksheetId),
                    worksheetAssignment: assignment
                }, { dirty: false });
                section.commit();

                me.setWorksheet(worksheetId);
            }
        });
    },

    onReportLoad: function(report) {
        var worksheetData = report.get('SbgWorksheet');

        this.getEditorForm().setSbgGrades(
            worksheetData &&
            worksheetData.worksheet_id == this.getWorksheet() &&
            worksheetData.grades
        );
    },

    onBeforeReportSave: function(report) {
        report.set('SbgWorksheet', {
            worksheet_id: this.getWorksheet(),
            grades: this.getEditorForm().getSbgGrades()
        });
    },

    onReportSave: function(report) {
        var worksheetData = report.get('SbgWorksheet');

        this.getEditorForm().setSbgGrades(
            worksheetData &&
            worksheetData.worksheet_id == this.getWorksheet() &&
            worksheetData.grades
        );
    }
});