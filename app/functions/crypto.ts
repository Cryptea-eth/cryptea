import { cryptoSymbol } from "crypto-symbol";

const { symbolLookup, nameLookup } = cryptoSymbol({
  Oasis: "ROSE" as const,
});


export const cryptoDeets = (index:string) => {

    const main = index.split(' ');

    let mainI = main[0];

    const words: { [index: string]: string } = {
        "matic": "polygon"
    }

    if (words[main[0]] !== undefined) {
        mainI = words[main[0]];   
    }
    
    const symbol = symbolLookup(mainI);

    const name: string = symbol ? nameLookup(symbol) as string : mainI;
   

    return { symbol, useName: name + (main[1] || '').replaceAll(/[()]/g, ''), name: name +' '+ (main[1] || ''), searchName: name }

}
