import fs from "fs";

import { faleGreen, faleRed, type SaveDataRequest } from "@/_proto";
import { NextResponse, type NextRequest } from "next/server";
import { getTempClienDataBigPath, getTempClienDataInfoPath } from "../vars";

const infoFileCache = new Map();

export async function POST(request: NextRequest) {
  if (request.body === null) return NextResponse.json(faleRed("No body"));
  try {
    const bodys: SaveDataRequest = await request.json();

    const results = await Promise.all(
      bodys.map((body) => {
        return new Promise((resolve) => {
          try {
            if (typeof body.name !== "string") throw new Error("No name");

            const nowEpoch = Date.now();
            const infoFileName = getTempClienDataInfoPath(body.name);
            const bigFileName = getTempClienDataBigPath(body.name);

            let infoDataContent = {
              latestTime: 0,
              latestData: null,
              last200data: [],
            };

            if (infoFileCache.has(body.name)) {
              infoDataContent = infoFileCache.get(body.name);
            } else if (fs.existsSync(infoFileName)) {
              infoDataContent = JSON.parse(
                fs.readFileSync(infoFileName, "utf-8")
              );
            }

            if (infoDataContent.latestTime < nowEpoch) {
              infoDataContent.latestTime = nowEpoch;
              // @ts-ignore-next-line
              infoDataContent.latestData = body.data;
              // @ts-ignore-next-line
              infoDataContent.last200data.push([nowEpoch, body.data]);
              if (infoDataContent.last200data.length > 200) {
                infoDataContent.last200data.shift();
              }
            }

            infoFileCache.set(body.name, infoDataContent);
            fs.writeFile(
              infoFileName,
              JSON.stringify(infoDataContent),
              () => {}
            );
            fs.appendFile(bigFileName, `${nowEpoch},${body.data}\n`, () => {});

            resolve(true);
          } catch (error: any) {
            resolve(false);
            console.error(error);
          }
        });
      })
    );

    if (results.includes(false)) {
      return NextResponse.json(faleRed("Error"));
    }

    return NextResponse.json(faleGreen("Saved"));
  } catch (error: any) {
    return NextResponse.json(faleRed(error?.message));
  }
}
