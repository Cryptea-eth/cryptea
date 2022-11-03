
import { useEffect, useState } from "react";
import timg from "../../../../public/images/logobigqr.png";

const UQRCode = require("@uqrcode/js");

const QrCode = ({style, data, size = 210}: {style: object, data: string, size?:number }) => {
    
    
    useEffect(() => {

      var qr = new UQRCode();

      qr.data = data;

      qr.size = size;

      qr.foregroundColor = "#3f211b";

      qr.foregroundImageSrc = timg.src;

      qr.style = "art";

      qr.foregroundRadius = 3;

      qr.make();

      let qrHtml = "";

      const markingRadius: any = {};

      const markings = qr.drawModules.map(
        ({ rowIndex, colIndex, color, x }: { rowIndex:number, colIndex: number, color?: string, x: number  }, i: number) => {
          const isWhite = (color || "").toLowerCase() == "#ffffff";

          if (
            // ((rowIndex >= 0 && rowIndex <= 6 && colIndex <= 6) ||
            //   (rowIndex >= 0 &&
            //     rowIndex <= 6 &&
            //     colIndex <= 28 &&
            //     colIndex >= 22) ||
            //   (colIndex >= 0 &&
            //     colIndex <= 6 &&
            //     rowIndex <= 28 &&
            //     rowIndex >= 22)) &&
            // !isWhite

            ((rowIndex >= 0 && rowIndex <= 6 && colIndex <= 6) ||
              (rowIndex >= 0 &&
                rowIndex <= 6 &&
                colIndex <= 36 &&
                colIndex >= 30) ||
              (colIndex >= 0 &&
                colIndex <= 6 &&
                rowIndex <= 36 &&
                rowIndex >= 30)) &&
            !isWhite
          ) {
            return 1;
          } else {
            if (markingRadius[x] == undefined && !isWhite) {
              markingRadius[x] = [i];
            } else {
              if (markingRadius[x] !== undefined) {
                const selected = markingRadius[x];

                if (
                  isWhite &&
                  selected.length >= 1 &&
                  selected[selected.length - 1] != "|"
                ) {
                  selected.push("|");
                } else if (!isWhite) {
                  selected.push(i);
                }
              }
            }
          }

          return 0;
        }
      );

      for (let i = 0; i < qr.drawModules.length; i++) {
        let drawModule = qr.drawModules[i];

        let rounded = "0px";

        if (markingRadius[drawModule.x].length > 1) {
          const fselected = markingRadius[drawModule.x].join().split(",|,");


          for (let ii = 0; ii < fselected.length; ii++) {
            const selected = fselected[ii].replace(",|", "").split(",");

            if (selected.length > 1) {
              if (selected.indexOf(String(i)) == selected.length - 1) {
                rounded = "0px 0px 50% 50%";
              } else if (!selected.indexOf(String(i))) {
                rounded = "50% 50% 0px 0px";
              }
            } else if (selected[0] == i) {
              rounded = "50%";
            }
          }
        }

        switch (drawModule.type) {
          case "block":
            qrHtml += `<div id="${i}" row="${
              drawModule.rowIndex !== undefined ? drawModule.rowIndex : ""
            }" column="${
              drawModule.colIndex !== undefined ? drawModule.colIndex : ""
            }" style="position: absolute;left: ${drawModule.x}px;top: ${
              drawModule.y
            }px;width: ${
              drawModule.width
            }px; border-radius:${rounded}; height: ${
              drawModule.height
            }px;background: ${drawModule.color};"></div>`;
            break;
          case "image":
            qrHtml += `<div style="background-color:#fff;border-radius:2rem;position:absolute;left: ${drawModule.x}px;top: ${drawModule.y}px;width: ${drawModule.width}px;height: ${drawModule.height}px;"><img style="position:absolute;width: ${drawModule.width}px;height: ${drawModule.height}px;" src="${drawModule.imageSrc}" /></div>`;

            break;
        }
      }


      (document.querySelector(".code") || { innerHTML: '' }).innerHTML = qrHtml;

    }, [data, size]);


    return (
      <div
        style={{
          width: size,
          height: size,
          ...style,
        }}
        className="relative code"
      >
      </div>
    );

}

export default QrCode;