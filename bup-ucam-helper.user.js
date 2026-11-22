// ==UserScript==
// @name         BUP UCAM Helper
// @namespace    https://github.com/SMAZY0210/bup-ucam-helper
// @version      6.2
// @description  Adds in-course mark calculator, grade predictor, attendance score /10 and expected-mark inputs to the BUP UCAM portal.
// @author       SMAZY0210
// @homepageURL  https://github.com/SMAZY0210/bup-ucam-helper
// @supportURL   https://github.com/SMAZY0210/bup-ucam-helper/issues
// @updateURL    https://raw.githubusercontent.com/SMAZY0210/bup-ucam-helper/main/bup-ucam-helper.user.js
// @downloadURL  https://raw.githubusercontent.com/SMAZY0210/bup-ucam-helper/main/bup-ucam-helper.user.js
// @match        *://*.bup.edu.bd/*
// @run-at       document-idle
// @grant        none
// @noframes
// ==/UserScript==


/* ─── injected stylesheet (was styles.css in the extension) ─── */
(function () {
    "use strict";
    var __bupCss = `/* ═══════════════════════════════════════════════
   BUP UCAM Helper — injected styles
   Works on the DEFAULT page UI with no overlay.
═══════════════════════════════════════════════ */

/* ── Injected summary / computed rows ── */
.bup-divider-row td {
    padding: 0 !important;
    height: 6px !important;
    background: transparent !important;
    border: none !important;
}

.bup-expected-row td {
    background: rgba(155, 89, 182, 0.05) !important;
    border-top: 1px dashed rgba(155, 89, 182, 0.3) !important;
}

.bup-computed-row td {
    background: rgba(77, 166, 255, 0.04) !important;
    border-top: 1px dashed rgba(77, 166, 255, 0.18) !important;
}

.bup-total-row td {
    background: linear-gradient(135deg, rgba(77,166,255,0.10) 0%, rgba(107,208,152,0.10) 100%) !important;
    border-top: 2px solid rgba(77,166,255,0.4) !important;
    border-bottom: 2px solid rgba(77,166,255,0.4) !important;
    padding-top: 10px !important;
    padding-bottom: 10px !important;
}

.bup-highlight-row td {
    background: rgba(243,156,18,0.06) !important;
}

/* ── Expected input ── */
.bup-exp-input {
    width: 68px;
    padding: 4px 7px;
    border: 1.5px solid rgba(155,89,182,0.5);
    border-radius: 6px;
    background: rgba(155,89,182,0.06);
    color: inherit;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    outline: none;
    font-family: inherit;
    transition: border-color .15s, box-shadow .15s;
}
.bup-exp-input:focus {
    border-color: #9b59b6;
    box-shadow: 0 0 0 2px rgba(155,89,182,0.15);
}
.bup-exp-label { font-size: 11px; color: #95a5a6; margin-left: 4px; }

/* ── Inline badges ── */
.bup-badge {
    display: inline-block;
    padding: 3px 9px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    min-width: 52px;
    text-align: center;
}
.bup-b-max  { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
.bup-b-got  { background: rgba(39,174,96,0.12); color: #27ae60; }
.bup-b-exp  { background: rgba(243,156,18,0.12); color: #d97706; }
.bup-b-pend { background: rgba(0,0,0,0.05); color: #95a5a6; font-style: italic; }
.bup-b-need { background: rgba(77,166,255,0.12); color: #2563eb; }

.bup-total-badge {
    display: inline-block;
    padding: 5px 14px;
    border-radius: 18px;
    font-weight: 800;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    min-width: 62px;
    text-align: center;
}
.bup-total-badge-max { background: #f1f5f9; color: #475569; border: 1.5px solid #cbd5e1; }
.bup-total-badge-got { background: linear-gradient(135deg,#4da6ff,#6bd098); color: #fff; box-shadow: 0 2px 8px rgba(77,166,255,.3); }

/* ── Grade chip ── */
.bup-grade-pill {
    display: inline-block;
    width: 34px; text-align: center;
    padding: 2px 0;
    border-radius: 5px;
    font-size: 12px;
    font-weight: 800;
}
.bup-g-hi  { background: rgba(39,174,96,0.12); color: #27ae60; }
.bup-g-mid { background: rgba(77,166,255,0.12); color: #2563eb; }
.bup-g-lo  { background: rgba(243,156,18,0.12); color: #d97706; }
.bup-g-flo { background: rgba(220,38,38,0.10);  color: #dc2626; }

.bup-chip {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 18px;
    font-size: 11px; font-weight: 600;
}
.bup-chip-ok  { background: rgba(39,174,96,0.12);  color: #27ae60; }
.bup-chip-no  { background: rgba(220,38,38,0.10);  color: #dc2626; }
.bup-chip-prov{ background: rgba(243,156,18,0.12); color: #d97706; }

/* ── Grade section card ── */
.bup-grade-section {
    margin-top: 16px;
    border: 1px solid rgba(0,0,0,0.07);
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.bup-grade-section-header {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 16px;
    background: #f8f9fa;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    font-size: 13px; font-weight: 700; color: #2c3e50;
}
.bup-grade-section-header i { color: #4da6ff; }

.bup-summary-strip {
    display: flex; flex-wrap: wrap; gap: 10px;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    background: rgba(77,166,255,0.02);
}
.bup-summary-chip {
    display: flex; flex-direction: column; gap: 1px;
    padding: 8px 14px;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.07);
    border-radius: 8px;
    min-width: 110px;
}
.bup-summary-chip-label {
    font-size: 10px; font-weight: 700; color: #95a5a6;
    text-transform: uppercase; letter-spacing: .05em;
}
.bup-summary-chip-val {
    font-size: 18px; font-weight: 800;
    font-variant-numeric: tabular-nums;
}
.bup-sv-accent { color: #4da6ff; }
.bup-sv-amber  { color: #d97706; }
.bup-sv-green  { color: #27ae60; }

/* ── Grade table inside section ── */
.bup-grade-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
}
.bup-grade-table th {
    padding: 8px 12px;
    text-align: center;
    color: #7f8c8d;
    font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .05em;
    background: #f8f9fa;
    border-bottom: 1px solid rgba(0,0,0,0.06);
}
.bup-grade-table th.left { text-align: left; }
.bup-grade-table td {
    padding: 9px 12px;
    text-align: center;
    vertical-align: middle;
    border-bottom: 1px solid rgba(0,0,0,0.04);
    color: #2c3e50;
}
.bup-grade-table td.left { text-align: left; color: #7f8c8d; }
.bup-grade-table tr:last-child td { border-bottom: none; }
.bup-grade-table tr:hover td { background: rgba(77,166,255,0.03); }

.bup-footnote {
    padding: 10px 16px;
    font-size: 11px; color: #95a5a6; font-style: italic;
    border-top: 1px solid rgba(0,0,0,0.05);
    background: #fafbfc;
    line-height: 1.6;
}

/* ── Attendance score column ── */
.bup-att-score-badge {
    display: inline-block;
    padding: 3px 9px;
    border-radius: 9px;
    font-size: 12px;
    font-weight: 700;
    min-width: 46px;
    text-align: center;
}

/* Score colours — explicit bg+fg, never inherits */
.bup-hi-score  { background: rgba(39,174,96,0.12);  color: #27ae60; }
.bup-mid-score { background: rgba(243,158,11,0.12); color: #d97706; }
.bup-lo-score  { background: rgba(220,38,38,0.10);  color: #dc2626; }

/* ── Provisional alert banner ── */
.bup-prov-alert {
    display: flex; align-items: flex-start; gap: 8px;
    padding: 10px 14px; margin: 10px 16px 0;
    border-radius: 7px;
    background: rgba(243,156,18,0.09);
    border: 1px solid rgba(243,156,18,0.35);
    color: #b97c0e;
    font-size: 12px; line-height: 1.5;
}
`;
    var __s = document.createElement("style");
    __s.id = "bup-ucam-helper-styles";
    __s.textContent = __bupCss;
    (document.head || document.documentElement).appendChild(__s);
})();

/* BUP UCAM Helper v5 — default UI, mark calculator only */
(function () {
"use strict";

/* ═══ TINY HELPERS ═══ */
function gt(el) {
    if (!el) return "";
    return ((el.innerText !== undefined ? el.innerText : el.textContent) || "").replace(/\s+/g," ").trim();
}
function pm(t) {
    t = (t||"").trim();
    if (!t || /^-+$/.test(t) || /^n\/?a$/i.test(t) || /pending/i.test(t)) return null;
    const n = parseFloat(t.replace(/,/g,""));
    return isFinite(n) ? n : null;
}
function f(n, d=2) { return (Math.round(n * 1e6) / 1e6).toFixed(d); }
function cel(tag, attrs={}, html="") {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v]) => { if (k==="class") el.className=v; else el.setAttribute(k,v); });
    if (html) el.innerHTML = html;
    return el;
}

/* ═══ GRADE SCALE ═══ */
const GS = [
    {g:"A+", min:80, max:100, gpa:4.00, d:"Outstanding"},
    {g:"A",  min:75, max:79,  gpa:3.75, d:"Excellent"},
    {g:"A-", min:70, max:74,  gpa:3.50, d:"Very Good"},
    {g:"B+", min:65, max:69,  gpa:3.25, d:"Good"},
    {g:"B",  min:60, max:64,  gpa:3.00, d:"Satisfactory"},
    {g:"B-", min:55, max:59,  gpa:2.75, d:"Above Average"},
    {g:"C+", min:50, max:54,  gpa:2.50, d:"Average"},
    {g:"C",  min:45, max:49,  gpa:2.25, d:"Below Average"},
    {g:"D",  min:40, max:44,  gpa:2.00, d:"Pass"},
    {g:"F",  min:0,  max:39,  gpa:0,    d:"Fail"},
];
function gradeFor(t) { return GS.find(g => t >= g.min) || GS[GS.length-1]; }
function gradePill(gr) {
    const cls = gr.min>=75?"bup-g-hi":gr.min>=60?"bup-g-mid":gr.min>=40?"bup-g-lo":"bup-g-flo";
    return `<span class="bup-grade-pill ${cls}">${gr.g}</span>`;
}

/* ═══ MARK COMPUTATION ═══ */
function isLab(rows) {
    return rows.some(r=>/^quiz$/i.test(r.name.trim())) && rows.some(r=>/viva/i.test(r.name));
}

function computeLab(rows, ev) {
    const COMP = [
        {key:"quiz", label:"Quiz",                    tgt:20, re:/^quiz$/i},
        {key:"ha",   label:"Home Assignment / Report", tgt:10, re:/home\s*assign|home\s*report/i},
        {key:"cp",   label:"Class Performance",        tgt:10, re:/class\s*perf/i},
        {key:"viva", label:"Viva",                     tgt:10, re:/^viva$/i},
        {key:"att",  label:"Attendance",               tgt:10, re:/attendance/i},
    ];
    const miss=[], bd=[];
    let total=0;
    COMP.forEach(c => {
        const row = rows.find(r => c.re.test(r.name.trim()));
        if (!row) return;
        let ob = row.obtained;
        if (ob===null && ev[c.key]!==undefined) ob=ev[c.key];
        const rawMax = row.max||c.tgt;
        let conv=null, isExp=false;
        if (ob!==null) { conv=(rawMax>0?(ob/rawMax)*c.tgt:0); isExp=row.obtained===null; total+=conv; }
        else miss.push(c.label);
        bd.push({key:c.key, label:c.label, rawMax, tgt:c.tgt, ob, conv, isExp, rowOb:row.obtained});
    });
    return {isLab:true, bd, total, totalMax:60, finalMax:40, prov:miss.length>0, missing:miss};
}

function computeTheory(rows, ev) {
    const cts  = rows.filter(r=>/class\s*test/i.test(r.name));
    const mid  = rows.find(r=>/mid[\s-]*term/i.test(r.name));
    const proj = rows.find(r=>/(project|assignment|term\s*paper|presentation)/i.test(r.name));
    const att  = rows.find(r=>/attendance/i.test(r.name));
    const miss=[];
    const gob=(row,k)=>{ if(!row)return null; if(row.obtained!==null)return row.obtained; return ev[k]!==undefined?ev[k]:null; };

    const validCT = cts.map((r,i)=>({max:r.max, ob:r.obtained!==null?r.obtained:(ev[`ct_${i}`]??null)})).filter(r=>r.ob!==null&&r.max);
    const topCT   = validCT.slice().sort((a,b)=>b.ob-a.ob).slice(0,3);
    let ctS=null, ctM=cts.length>0?10:0;
    if (topCT.length>0) ctS=(topCT.reduce((s,r)=>s+r.ob,0)/topCT.length)/(topCT.reduce((s,r)=>s+r.max,0)/topCT.length)*10;
    else if (cts.length>0) miss.push("Class Test");
    const pendCT = cts.filter(r=>r.obtained===null);
    if (pendCT.length>0 && topCT.length>0) miss.push(`${pendCT.length} CT(s) pending`);

    let midS=null, midM=mid?20:0;
    if (mid) { const ob=gob(mid,"mid"); if(ob!==null&&mid.max)midS=(ob/mid.max)*20; else if(ob===null)miss.push("Mid Term"); }

    let projS=null, projM=proj?(proj.max||0):0;
    if (proj) { const ob=gob(proj,"proj"); if(ob!==null)projS=ob; else miss.push("Project/Assignment"); }

    let attS=null, attM=att?(att.max||0):0;
    if (att) { const ob=gob(att,"att"); if(ob!==null)attS=ob; else miss.push("Attendance"); }

    const totalMax=ctM+midM+projM+attM;
    const total=(ctS||0)+(midS||0)+(projS||0)+(attS||0);
    return {isLab:false, cts, mid, proj, att, ctS, ctM, midS, midM, projS, projM, attS, attM, total, totalMax, finalMax:100, prov:miss.length>0, missing:miss};
}

function computeReqs(inc) {
    return GS.map(g => {
        const need = inc.isLab ? (g.min-inc.total) : ((g.min-inc.total)*2);
        let status, req;
        if (need<=0)              { status="ok";   req=0; }
        else if (need>inc.finalMax){ status="no";   req=null; }
        else                      { status="need"; req=need; }
        return {...g, status, req};
    });
}

/* ═══ SCRAPE EXAM ROWS ═══ */
function scrapeRows() {
    const tbl = document.getElementById("ctl00_MainContainer_gvgvExamMarkSummaryDetails");
    if (!tbl) return [];
    return Array.from(tbl.querySelectorAll("tbody tr"))
        .filter(tr => !tr.querySelector("th") && !tr.dataset.bupInj)
        .map(tr => {
            const tds = tr.querySelectorAll("td");
            if (tds.length < 4) return null;
            return { name: gt(tds[1]), max: pm(gt(tds[2])), obtained: pm(gt(tds[3])) };
        })
        .filter(r => r && r.name);
}

/* ═══ STATE ═══ */
let ST = { rows:[], isLab:false, ev:{}, inc:null, sig:"" };

/* ═══ MAIN INJECTION ═══ */
function inject() {
    const tbl = document.getElementById("ctl00_MainContainer_gvgvExamMarkSummaryDetails");
    if (!tbl) return;

    const rows = scrapeRows();
    if (!rows.length) return;
    const sig = rows.map(r=>`${r.name}:${r.max}:${r.obtained}`).join("|");
    if (sig === ST.sig) return; // nothing changed
    ST.sig = sig; ST.rows = rows; ST.ev = {}; ST.isLab = isLab(rows);
    ST.inc = ST.isLab ? computeLab(rows,{}) : computeTheory(rows,{});

    // Remove previous injections
    tbl.querySelectorAll("[data-bup-inj]").forEach(el=>el.remove());
    const old = document.getElementById("bup-grade-section");
    if (old) old.remove();

    const tbody = tbl.querySelector("tbody");
    if (!tbody) return;

    const inc = ST.inc;

    // ── Expected input rows ──
    buildExpectedRows(inc).forEach(tr => tbody.appendChild(tr));

    // ── Computed summary rows ──
    buildComputedRows(inc).forEach(tr => tbody.appendChild(tr));

    // ── Total row ──
    tbody.appendChild(buildTotalRow(inc));

    // ── Bind live update on inputs ──
    tbl.querySelectorAll(".bup-exp-input").forEach(inp => {
        inp.addEventListener("input", liveUpdate);
    });

    // ── Grade section below table ──
    injectGradeSection(inc);
}

/* ── Expected rows ── */
function buildExpectedRows(inc) {
    const rows = [];
    function row(label, key, rawMax, rowOb) {
        if (rowOb !== null) return null; // already posted
        const tr = document.createElement("tr");
        tr.dataset.bupInj = "1";
        tr.className = "bup-expected-row";
        tr.innerHTML = `
            <td align="center" style="width:44px"><span class="row-num" style="background:linear-gradient(135deg,#9b59b6,#8e44ad)">✎</span></td>
            <td style="color:#8e44ad;font-weight:600;font-size:12px">Expected: ${label}</td>
            <td align="center"><span style="color:#95a5a6;font-size:11px">/ ${rawMax||"?"}</span></td>
            <td align="center">
                <input class="bup-exp-input" type="number" step="0.01" min="0" max="${rawMax||999}"
                    data-ek="${key}" placeholder="0.00">
                <span class="bup-exp-label">/ ${rawMax||"?"}</span>
            </td>`;
        return tr;
    }

    if (inc.isLab) {
        inc.bd.filter(b=>b.rowOb===null).forEach(b => {
            const tr = row(b.label, b.key, b.rawMax, b.rowOb);
            if (tr) rows.push(tr);
        });
    } else {
        inc.cts && inc.cts.forEach((r,i) => {
            if (r.obtained !== null) return;
            const tr = row(`Class Test ${i+1}`, `ct_${i}`, r.max, r.obtained);
            if (tr) rows.push(tr);
        });
        [
            [inc.mid,  "Mid Term",           "mid"],
            [inc.proj, "Project/Assignment",  "proj"],
            [inc.att,  "Attendance",          "att"],
        ].forEach(([r, lbl, key]) => {
            if (!r || r.obtained !== null) return;
            const tr = row(lbl, key, r.max, r.obtained);
            if (tr) rows.push(tr);
        });
    }
    return rows;
}

/* ── Computed rows ── */
function buildComputedRows(inc) {
    const rows = [];
    function makeRow(label, maxVal, gotHtml, note="") {
        const tr = document.createElement("tr");
        tr.dataset.bupInj = "1";
        tr.className = "bup-computed-row";
        tr.innerHTML = `
            <td align="center" style="width:44px"><span class="row-num" style="background:linear-gradient(135deg,#4da6ff,#6bd098)">∑</span></td>
            <td style="font-size:12px">${label}${note?`<span style="color:#95a5a6;font-size:10px;margin-left:4px">${note}</span>`:""}</td>
            <td align="center"><span class="bup-badge bup-b-max">${f(maxVal)}</span></td>
            <td align="center" class="bup-comp-cell">${gotHtml}</td>`;
        return tr;
    }

    if (inc.isLab) {
        inc.bd.forEach(b => {
            const note = b.rawMax !== b.tgt ? `(×${(b.tgt/b.rawMax).toFixed(3).replace(/\.?0+$/,"")} → /${b.tgt})` : `(out of ${b.tgt})`;
            const gotHtml = b.conv !== null
                ? `<span class="bup-badge ${b.isExp?"bup-b-exp":"bup-b-got"}" data-bup-lab="${b.key}">${f(b.conv)}${b.isExp?"<span style='font-size:9px;opacity:.7;margin-left:2px'>exp</span>":""}</span>`
                : `<span class="bup-badge bup-b-pend" data-bup-lab="${b.key}">—</span>`;
            rows.push(makeRow(b.label, b.tgt, gotHtml, note));
        });
    } else {
        if (inc.cts && inc.cts.length > 0) {
            const note = `(best 3 of ${inc.cts.length} → /10)`;
            const gotHtml = inc.ctS !== null
                ? `<span class="bup-badge bup-b-got" id="bup-ct-val">${f(inc.ctS)}</span>`
                : `<span class="bup-badge bup-b-pend" id="bup-ct-val">—</span>`;
            rows.push(makeRow("Class Test Average", inc.ctM, gotHtml, note));
        }
        if (inc.mid) {
            const gotHtml = inc.midS !== null
                ? `<span class="bup-badge bup-b-got" id="bup-mid-val">${f(inc.midS)}</span>`
                : `<span class="bup-badge bup-b-pend" id="bup-mid-val">—</span>`;
            rows.push(makeRow("Mid Term", inc.midM, gotHtml, "(scaled → /20)"));
        }
    }
    return rows;
}

/* ── Total row ── */
function buildTotalRow(inc) {
    const tr = document.createElement("tr");
    tr.dataset.bupInj = "1";
    tr.id = "bup-total-row";
    tr.className = "bup-total-row";
    tr.innerHTML = `
        <td align="center"><span class="row-num" style="background:linear-gradient(135deg,#4da6ff,#6bd098);width:26px;height:26px;font-size:14px">∑</span></td>
        <td style="font-weight:700;font-size:13px">
            Total In-Course${inc.isLab?" <span style='color:#9b59b6;font-size:11px'>(LAB)</span>":""}
            ${inc.prov?`<span class="bup-chip bup-chip-prov" style="margin-left:8px">⚠ Provisional</span>`:""}
        </td>
        <td align="center"><span class="bup-total-badge bup-total-badge-max">${f(inc.totalMax)}</span></td>
        <td align="center"><span class="bup-total-badge bup-total-badge-got" id="bup-total-got">${f(inc.total)}</span></td>`;
    return tr;
}

/* ── Grade section ── */
function injectGradeSection(inc) {
    const reqs = computeReqs(inc);
    const worstG = gradeFor(inc.total);
    const bestG  = gradeFor(Math.min(inc.total+inc.finalMax, 100));
    const finalLbl = inc.isLab ? "Lab Final / Project (out of 40)" : "Final Exam needed (out of 100)";
    const provBanner = inc.prov ? `
        <div class="bup-prov-alert">
            ⚠ <div>Provisional — awaiting: ${inc.missing.join(", ")}.<br>Enter expected marks above to simulate.</div>
        </div>` : "";

    const gradeRows = reqs.map(r => {
        let cell;
        if (r.status==="ok")   cell = `<span class="bup-chip bup-chip-ok">✓ Secured</span>`;
        else if (r.status==="no") cell = `<span class="bup-chip bup-chip-no">✗ Not achievable</span>`;
        else cell = `<span class="bup-badge bup-b-need" id="bup-gr-${r.g.replace(/\W/g,"_")}">${f(r.req)}</span>`;
        return `<tr class="${r.g===worstG.g?"bup-highlight-row":""}">
            <td>${gradePill(r)}</td>
            <td class="left">${r.min}–${r.max}</td>
            <td>${r.gpa.toFixed(2)}</td>
            <td class="left" style="color:#7f8c8d">${r.d}</td>
            <td id="bup-gr-cell-${r.g.replace(/\W/g,"_")}">${cell}</td>
        </tr>`;
    }).join("");

    const section = document.createElement("div");
    section.id = "bup-grade-section";
    section.className = "bup-grade-section";
    section.innerHTML = `
        ${provBanner}
        <div class="bup-grade-section-header">
            <i class="fas fa-bullseye"></i>
            ${finalLbl}
        </div>
        <div class="bup-summary-strip" id="bup-summary-strip">
            <div class="bup-summary-chip">
                <span class="bup-summary-chip-label">In-Course</span>
                <span class="bup-summary-chip-val bup-sv-accent" id="bup-summ-inc">
                    ${f(inc.total)} <span style="font-size:12px;font-weight:500;color:#95a5a6">/ ${f(inc.totalMax)}</span>
                </span>
            </div>
            <div class="bup-summary-chip">
                <span class="bup-summary-chip-label">Current Floor</span>
                <span class="bup-summary-chip-val bup-sv-amber" id="bup-summ-worst">${worstG.g}</span>
            </div>
            <div class="bup-summary-chip">
                <span class="bup-summary-chip-label">Best Possible</span>
                <span class="bup-summary-chip-val bup-sv-green" id="bup-summ-best">${bestG.g}</span>
            </div>
            ${inc.isLab?`<div class="bup-summary-chip">
                <span class="bup-summary-chip-label">Lab Final</span>
                <span class="bup-summary-chip-val" style="font-size:13px;color:#7f8c8d">out of 40</span>
            </div>`:""}
        </div>
        <table class="bup-grade-table">
            <thead><tr>
                <th>Grade</th><th class="left">Range</th><th>GPA</th>
                <th class="left">Description</th><th>${finalLbl}</th>
            </tr></thead>
            <tbody id="bup-grade-rows">${gradeRows}</tbody>
        </table>
        <div class="bup-footnote">
            ${inc.isLab
                ? "Lab In-Course = Quiz(20) + Home Assignment(10) + Class Performance(10) + Viva(10) + Attendance(10) = 60. Lab Final / Project = 40."
                : "Theory In-Course (/50) + Final Exam × 0.5 = 100 overall."}
            &nbsp;BUP UCAM Helper — verify with your teacher's official scheme.
        </div>`;

    // Insert after the details data-section div
    const detailsSection = document.querySelector("#ctl00_MainContainer_UpdatePanel2 .data-section");
    if (detailsSection && detailsSection.parentElement) {
        detailsSection.parentElement.insertBefore(section, detailsSection.nextSibling);
    } else {
        // fallback — append to UpdatePanel2
        const up2 = document.getElementById("ctl00_MainContainer_UpdatePanel2");
        if (up2) up2.appendChild(section);
    }
}

/* ═══ LIVE UPDATE ═══ */
function liveUpdate() {
    ST.ev = {};
    document.querySelectorAll(".bup-exp-input").forEach(inp => {
        const v = parseFloat(inp.value);
        if (isFinite(v) && v >= 0) ST.ev[inp.dataset.ek] = v;
    });
    const inc = ST.isLab ? computeLab(ST.rows, ST.ev) : computeTheory(ST.rows, ST.ev);
    ST.inc = inc;
    const reqs = computeReqs(inc);
    const worstG = gradeFor(inc.total);
    const bestG  = gradeFor(Math.min(inc.total+inc.finalMax, 100));

    // total badge
    const tg = document.getElementById("bup-total-got");
    if (tg) tg.textContent = f(inc.total);

    // summary chips
    const si = document.getElementById("bup-summ-inc");
    if (si) si.innerHTML = `${f(inc.total)} <span style="font-size:12px;font-weight:500;color:#95a5a6">/ ${f(inc.totalMax)}</span>`;
    const sw = document.getElementById("bup-summ-worst"); if (sw) sw.textContent = worstG.g;
    const sb = document.getElementById("bup-summ-best");  if (sb) sb.textContent = bestG.g;

    // lab computed cells
    if (inc.isLab) {
        inc.bd.forEach(b => {
            const el = document.querySelector(`[data-bup-lab="${b.key}"]`);
            if (!el) return;
            el.className = `bup-badge ${b.conv!==null?(b.isExp?"bup-b-exp":"bup-b-got"):"bup-b-pend"}`;
            el.innerHTML = b.conv!==null
                ? f(b.conv)+(b.isExp?`<span style="font-size:9px;opacity:.7;margin-left:2px">exp</span>`:"")
                : "—";
        });
    } else {
        const ctEl = document.getElementById("bup-ct-val");
        if (ctEl) { ctEl.className=`bup-badge ${inc.ctS!==null?"bup-b-got":"bup-b-pend"}`; ctEl.textContent=inc.ctS!==null?f(inc.ctS):"—"; }
        const midEl= document.getElementById("bup-mid-val");
        if (midEl){ midEl.className=`bup-badge ${inc.midS!==null?"bup-b-got":"bup-b-pend"}`; midEl.textContent=inc.midS!==null?f(inc.midS):"—"; }
    }

    // grade rows
    reqs.forEach(r => {
        const cellEl = document.getElementById(`bup-gr-cell-${r.g.replace(/\W/g,"_")}`);
        if (!cellEl) return;
        if (r.status==="ok")   cellEl.innerHTML=`<span class="bup-chip bup-chip-ok">✓ Secured</span>`;
        else if (r.status==="no") cellEl.innerHTML=`<span class="bup-chip bup-chip-no">✗ Not achievable</span>`;
        else cellEl.innerHTML=`<span class="bup-badge bup-b-need">${f(r.req)}</span>`;
        const tr = cellEl.closest("tr");
        if (tr) tr.className = r.g===worstG.g ? "bup-highlight-row" : "";
    });
}

/* ═══ ATTENDANCE INJECTION ═══ */
function injectAttendance() {
    const tbl = document.getElementById("ctl00_MainContainer_gvClassAttendanceSummary");
    if (!tbl || tbl.dataset.bupAtt) return;

    // Find header row — the one that contains <th> elements
    const headerRow = tbl.querySelector("tr:has(th)") || tbl.querySelector("tr");
    if (!headerRow) return;
    const ths = Array.from(headerRow.querySelectorAll("th"));
    if (!ths.length) return;
    if (ths.some(t => t.dataset.bupAdded)) return; // already done

    const iP      = ths.findIndex(t => /present/i.test(t.textContent));
    const iA      = ths.findIndex(t => /absent/i.test(t.textContent));
    const iAction = ths.findIndex(t => /action/i.test(t.textContent));
    if (iP < 0 || iA < 0) return;

    // ── Insert header cell BEFORE the Action column ──
    // If Action column exists, insert before it; otherwise append.
    const actionTh = iAction >= 0 ? ths[iAction] : null;

    const scTh = document.createElement("th");
    scTh.scope = "col";
    scTh.dataset.bupAdded = "1";
    scTh.style.cssText = "text-align:center; white-space:nowrap; min-width:80px;";
    scTh.textContent = "Score /10";

    if (actionTh) {
        headerRow.insertBefore(scTh, actionTh);
    } else {
        headerRow.appendChild(scTh);
    }

    // ── Process every data row ──
    const dataRows = Array.from(tbl.querySelectorAll("tbody tr"))
        .filter(tr => !tr.querySelector("th"));

    dataRows.forEach(tr => {
        const tds = Array.from(tr.querySelectorAll("td"));
        if (tds.length <= Math.max(iP, iA)) return;

        // Read counts
        const pEl = tds[iP].querySelector(".present-count");
        const aEl = tds[iA].querySelector(".absent-count");
        const pN  = parseInt(pEl ? pEl.textContent.trim() : (tds[iP] ? tds[iP].textContent.trim() : "0"), 10) || 0;
        const aN  = parseInt(aEl ? aEl.textContent.trim() : (tds[iA] ? tds[iA].textContent.trim() : "0"), 10) || 0;
        const tot = pN + aN;

        // Build score cell
        const newScTd = document.createElement("td");
        newScTd.align = "center";
        newScTd.valign = "middle";
        newScTd.dataset.bupAdded = "1";

        if (tot > 0) {
            const pct   = (pN / tot) * 100;
            const score = pct / 10;
            const scCls = pct >= 75 ? "bup-hi-score" : pct >= 60 ? "bup-mid-score" : "bup-lo-score";
            newScTd.innerHTML = `<span class="bup-att-score-badge ${scCls}">${score.toFixed(2)}</span>`;
        } else {
            newScTd.innerHTML = `<span style="color:#95a5a6;font-size:12px">—</span>`;
        }

        // Insert BEFORE the Action cell (last td in this row)
        const actionTd = tds[iAction] || null;
        if (actionTd) {
            tr.insertBefore(newScTd, actionTd);
        } else {
            tr.appendChild(newScTd);
        }
    });

    tbl.dataset.bupAtt = "1";
}

/* ═══ FACULTY EVALUATION HELPER ═══ */
function injectEvalHelper() {
    const RATINGS = ["Excellent","Very good","Good","Average","Poor"];
    const hasR = () => {
        for (const rd of document.querySelectorAll("input[type=radio]")) {
            const c = rd.closest("td")||rd.parentElement;
            if (c && RATINGS.some(r=>c.innerText.toLowerCase().includes(r.toLowerCase()))) return true;
        }
        return false;
    };
    if (!hasR() || document.getElementById("bup-eval-panel")) return;
    const panel = document.createElement("div");
    panel.id = "bup-eval-panel";
    Object.assign(panel.style, {
        position:"fixed", top:"80px", right:"20px", zIndex:"9999999",
        background:"#fff", border:"1px solid #e2e8f0", borderRadius:"10px",
        padding:"14px", boxShadow:"0 4px 16px rgba(0,0,0,.12)", minWidth:"170px",
        fontFamily:"inherit",
    });
    panel.innerHTML=`<div style="font-size:11px;font-weight:700;color:#95a5a6;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Quick Evaluate</div>`+
        RATINGS.map(r=>`<button data-r="${r}" style="display:block;width:100%;margin-bottom:5px;padding:7px 12px;border-radius:7px;border:1px solid #4da6ff;background:rgba(77,166,255,0.06);color:#4da6ff;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;text-align:left">All ${r}</button>`).join("");
    panel.querySelectorAll("button[data-r]").forEach(btn=>{
        btn.onclick=()=>{
            document.querySelectorAll("input[type=radio]").forEach(rd=>{
                const c=rd.parentElement||rd.closest("td");
                if(c&&c.innerText.trim().toLowerCase().includes(btn.dataset.r.toLowerCase())){
                    rd.checked=true; rd.dispatchEvent(new Event("change",{bubbles:true}));
                }
            });
        };
    });
    document.body.appendChild(panel);
}

/* ═══ WATCHER ═══ */
function watchExamPanel() {
    const up2 = document.getElementById("ctl00_MainContainer_UpdatePanel2");
    if (up2) {
        new MutationObserver(()=>setTimeout(inject, 80)).observe(up2, {childList:true, subtree:true});
    }
    // Session dropdown change triggers UpdatePanel03
    const ddl = document.getElementById("ctl00_MainContainer_ddlSession");
    if (ddl) {
        // Watch UpdatePanel03 for course list refresh
        const up03 = document.getElementById("ctl00_MainContainer_UpdatePanel03");
        if (up03) {
            new MutationObserver(()=>{
                // clear old grade section when new session selected
                const old = document.getElementById("bup-grade-section");
                if (old) old.remove();
                ST.sig=""; // force re-inject on next update
            }).observe(up03, {childList:true, subtree:true});
        }
    }
    // Watch body for attendance table appearing
    new MutationObserver(()=>{ injectAttendance(); injectEvalHelper(); })
        .observe(document.body, {childList:true, subtree:true});
}

/* ═══ BOOT ═══ */
function boot() {
    inject();
    injectAttendance();
    injectEvalHelper();
    watchExamPanel();
    // Retry a few times for AJAX pages
    setTimeout(inject, 800);
    setTimeout(inject, 2000);
    setTimeout(injectAttendance, 1000);
}

if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
else boot();

})();

