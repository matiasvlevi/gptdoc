function replaceAllMatches(value:string, reg:RegExp, desired:string) {
    let matches = value.match(reg);
    if (matches === null) return value;

    Array.from(matches).forEach((match:string) => {
      value = value.replace(match, desired);
    });

    return value;
  }

export function minify(src: string) {
    src = replaceAllMatches(src, /[\n\r\t\0]/g, '');
    src = replaceAllMatches(src, / =/g, '=');
    src = replaceAllMatches(src, / \+/g, '+');
    src = replaceAllMatches(src, / -/g, '-');
    src = replaceAllMatches(src, / \*/g, '*');
    src = replaceAllMatches(src, / \//g, '/');
    src = replaceAllMatches(src, /= /g, '=');
    src = replaceAllMatches(src, /\+ /g, '+');
    src = replaceAllMatches(src, /- /g, '-');
    src = replaceAllMatches(src, /\* /g, '*');
    src = replaceAllMatches(src, /\/ /g, '/');

    src = replaceAllMatches(src, / </g, '<');
    src = replaceAllMatches(src, /< /g, '<');
    src = replaceAllMatches(src, / >/g, '>');
    src = replaceAllMatches(src, /> /g, '>');
    src = replaceAllMatches(src, / <=/g, '<=');
    src = replaceAllMatches(src, /<= /g, '<=');
    src = replaceAllMatches(src, / >=/g, '>=');
    src = replaceAllMatches(src, />= /g, '>=');
    src = replaceAllMatches(src, / ==/g, '==');
    src = replaceAllMatches(src, /== /g, '==');
    src = replaceAllMatches(src, / ===/g, '===');
    src = replaceAllMatches(src, /=== /g, '===');

    src = replaceAllMatches(src, / \+=/g, '+=');
    src = replaceAllMatches(src, / \-=/g, '-=');
    src = replaceAllMatches(src, / \/=/g, '/=');
    src = replaceAllMatches(src, / \*=/g, '*=');
    src = replaceAllMatches(src, /\+= /g, '+=');
    src = replaceAllMatches(src, /\-= /g, '-=');
    src = replaceAllMatches(src, /\/= /g, '/=');
    src = replaceAllMatches(src, /\*= /g, '*=');

    src = replaceAllMatches(src, /do \{/g, 'do{');
    src = replaceAllMatches(src, /try \{/g, 'try{');
    src = replaceAllMatches(src, /for \(/g, 'for(');
    src = replaceAllMatches(src, /if \(/g, 'if(');
    src = replaceAllMatches(src, /while \(/g, 'while(');

    src = replaceAllMatches(src, /[ ]{2,}/g, ' ');

    src = replaceAllMatches(src, /\}\s*/gm, '}');
    src = replaceAllMatches(src, /\) {/gm, '){');
    src = replaceAllMatches(src, /;\}/gm, '}');
    src = replaceAllMatches(src, /\{ /gm, '{');
    src = replaceAllMatches(src, /\s\{/gm, '{');

    src = replaceAllMatches(src, /,\s/gm, ',');
    src = replaceAllMatches(src, /\s,/gm, ',');

    src = replaceAllMatches(src, /; /g, ';');
  
    return src;
  }