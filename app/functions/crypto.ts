import { cryptoSymbol } from "crypto-symbol";
import map from "crypto-icons-plus/map.min.json";

const { symbolLookup, nameLookup } = cryptoSymbol({
  Oasis: "ROSE" as const,
});

const mainMap: { [index:string]: any } = map;

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

    let img = require("../../public/images/generic.svg");

    if (mainMap[symbol as string] !== undefined || symbol !== undefined) {
      if (mainMap[symbol as string] > 1) {
        mainMap[symbol as string].forEach((element: string) => {
          if (name.toLowerCase() == mainI.toLowerCase()) {
            img = require(`crypto-icons-plus-32/src/${element}.png`);
          }
        });
      } else {
        img = require(`crypto-icons-plus-32/src/${mainMap[symbol as string][0]}.png`);
      }
    }   

    return { symbol, useName: name + (main[1] || '').replaceAll(/[()]/g, ''), name: name + (main[1] || ''), img }

}