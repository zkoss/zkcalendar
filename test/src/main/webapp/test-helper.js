/* check if a specific selector with a specific property-value pair is applied to an element */
function isCssRuleApplied(element, selector, property, value) {
    // Check if any of the stylesheets contain the specific rule
    for (const sheet of document.styleSheets) {
        if (sheet.href && sheet.href.endsWith('css.dsp')) { // Only check in zk.wcs file
            const rules = sheet.cssRules;
            for (const rule of rules) {
                console.log(rule.selectorText);
                if (rule.selectorText.indexOf(selector)!= -1 && rule.style[property] === value) {
                    // Check if the element matches the rule's selector
                    if (element.matches(selector)) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}