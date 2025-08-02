let showTranslations = true;
let showHighlights = true;

const caryPassages = window.caryData;
const longfellowPassages = window.longfellowData;
const nortonPassages = window.nortonData;
const cantos = window.cantosData;
const highlighting = window.highlightingData;

function highlightMatchingLines(translationName, canto, lineNumber) {
    if (!showHighlights) return;
    clearHighlights();
    const matching = highlighting[canto];
    if (!matching) return;
    
    let translationIndex;
    if (translationName === 'cary') {
        translationIndex = 0;
    } else if (translationName === 'longfellow') {
        translationIndex = 1;
    } else if (translationName === 'norton') {
        translationIndex = 2;
    }

    let matchingLineGroup = null;
    const allLineGroups = Object.values(matching);
    for (let i = 0; i < allLineGroups.length; i++) {
        const lineGroup = allLineGroups[i];
        const lineReference = lineGroup[translationIndex];
        const lineNumbers = parseLineReference(lineReference);
        if (lineNumbers.includes(lineNumber)) {
            matchingLineGroup = lineGroup;
            break;
        }
    }
    if (!matchingLineGroup) return;
    
    const translationNames = ['cary', 'longfellow', 'norton'];
    for (let i = 0; i < matchingLineGroup.length; i++) {
        const lineReference = matchingLineGroup[i];
        if (lineReference === null) continue;
        const lineNumbers = parseLineReference(lineReference);
        for (let j = 0; j < lineNumbers.length; j++) {
            const lineId = getLineId(translationNames[i], canto, lineNumbers[j]);
            const lineElement = document.getElementById(lineId);
            if (lineElement) lineElement.classList.add('highlighted');
        }
    }
}

function renderCantos() {
    const container = document.getElementById('cantos-container');
    const select = document.getElementById('cantoSelect');
    if (!cantos || !caryPassages || !longfellowPassages || !nortonPassages || !highlighting) {
        container.innerHTML = '<div class="error">Failed to load required data files</div>';
        return;
    }
    
    let html = '';
    for (let i = 0; i < 34; i++) {
        const canto = cantos[i];
        const cantoNumber = canto.number.toString();
        const option = document.createElement('option');
        option.value = canto.number;
        option.textContent = 'Canto ' + canto.number;
        select.appendChild(option);
        
        html += `<div class="canto" id="canto-${canto.number}">`;
        html += '<div class="canto-header">';
        html += `<div class="canto-title">${canto.title}</div>`;
        html += `<div class="canto-subtitle">${canto.subtitle}</div>`;
        html += '</div>';
        
        html += '<div class="translations">';
        html += '<div class="translation"><h4>Cary Translation</h4>';
        if (caryPassages[cantoNumber]) {
            for (let lineIndex = 0; lineIndex < caryPassages[cantoNumber].length; lineIndex++) {
                const line = caryPassages[cantoNumber][lineIndex];
                const lineId = getLineId('cary', cantoNumber, lineIndex);
                html += '<div class="line" id="' + lineId + '" ';
                html += `onmouseenter="highlightMatchingLines('cary', '${cantoNumber}', ${lineIndex})"`;
                html += 'onmouseleave="clearHighlights()">' + line + '</div>';
            }
        }
        html += '</div>';
        
        html += '<div class="translation"><h4>Longfellow Translation</h4>';
        if (longfellowPassages[cantoNumber]) {
            for (let lineIndex = 0; lineIndex < longfellowPassages[cantoNumber].length; lineIndex++) {
                const line = longfellowPassages[cantoNumber][lineIndex];
                const lineId = getLineId('longfellow', cantoNumber, lineIndex);
                html += '<div class="line" id="' + lineId + '" ';
                html += `onmouseenter="highlightMatchingLines('longfellow', '${cantoNumber}', ${lineIndex})"`;
                html += 'onmouseleave="clearHighlights()">' + line + '</div>';
            }
        }
        html += '</div>';
        
        html += '<div class="translation"><h4>Norton Translation</h4>';
        if (nortonPassages[cantoNumber]) {
            for (let lineIndex = 0; lineIndex < nortonPassages[cantoNumber].length; lineIndex++) {
                const line = nortonPassages[cantoNumber][lineIndex];
                const lineId = getLineId('norton', cantoNumber, lineIndex);
                html += '<div class="line" id="' + lineId + '" ';
                html += `onmouseenter="highlightMatchingLines('norton', '${cantoNumber}', ${lineIndex})"`;
                html += `onmouseleave="clearHighlights()">${line}</div>`;
            }
        }
        html += '</div></div>';
        
        html += '<div class="commentary">';
        html += `<div class="commentary"><h4>Subtext</h4><p>${canto.subtext}</p></div>`;
        html += `<div class="commentary"><h4>Themes</h4><p>${canto.themes}</p></div>`;
        html += `<div class="commentary"><h4>References</h4><p>${canto.references}</p></div>`;
        html += `<div class="commentary"><h4>Characters</h4><p>${canto.characters}</p></div>`;
        html += '</div></div>';
    }
    container.innerHTML = html;
}

function getLineId(translation, canto, lineIndex) {
    return `${translation}-${canto}-${lineIndex}`;
}

function clearHighlights() {
    const highlighted = document.querySelectorAll('.line.highlighted');
    for (let i = 0; i < highlighted.length; i++) {
        highlighted[i].classList.remove('highlighted');
    }
}

function parseLineReference(lineRef) {
    if (typeof lineRef === 'number') return [lineRef];
    const parts = lineRef.split('-');
    const start = parseInt(parts[0]);
    const end = parseInt(parts[1]);
    const lines = [];
    for (let i = start; i <= end; i++) {
        lines.push(i);
    }
    return lines;
}

function toggleTranslations() {
    const translations = document.getElementsByClassName('translations');
    const button = document.getElementById('translationToggle')
    showTranslations = !showTranslations;
    for (let i = 0; i < translations.length; i++) {
        translations[i].style.display = showTranslations ? 'grid' : 'none';
    }
    button.textContent = showTranslations ? "Hide All Translations" : "Show All Translations"
}

function toggleHighlighting() {
    const button = document.getElementById('highlightToggle');
    showHighlights = !showHighlights;
    if (!showHighlights) clearHighlights();
    button.textContent = showHighlights ? "Disable Highlighting" : "Enable Highlighting"
}

document.getElementById('cantoSelect').onchange = function() {
    if (this.value) document.getElementById('canto-' + this.value).scrollIntoView();
};

document.addEventListener('DOMContentLoaded', renderCantos());