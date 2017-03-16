{extends "progress/section-term-reports/sectionTermReport.css.tpl"}
th, td.grade {
    font-family: Helvetica Neue, Helvetica, Arial, Verdana, sans-serif !important;
}
.prompts {
    border-collapse: collapse;
    margin-bottom: 1em;
    width: 100%;
    page-break-before: avoid;
}

.prompt {
    text-align: left;
    width: 80%;
}

.prompts .grade {
    text-align: right;
}

.prompts th, .prompts td {
    padding: .5em 0;
}

.prompts td {
    border-top: 1px dotted #999;
}

.prompts tr:first-child td {
    border-top: 0;
}

.grade {
    white-space: nowrap;
}

dd.standards {
    clear: left;
    line-height: 1.4;
    margin: 0.5em .25in 1em;
}