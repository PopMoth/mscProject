"use server";
import { promises as fs } from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY not set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export type ShowList = {
  shows: { title: string; seasons: { episodeCount: number }[] }[];
};

export async function getShowList(): Promise<ShowList> {
  const file = await fs.readFile(
    process.cwd() + "/app/data/seriesData.json",
    "utf-8",
  );
  const jsonData = JSON.parse(file);

  const shows = Object.entries(jsonData).map(
    ([key, data]: [key: string, data: any]) => {
      return {
        title: key,
        seasons: Object.values(data).map((season: any) => {
          return {
            episodeCount: season.length,
          };
        }),
      };
    },
  );

  return { shows };
}

export async function getShowSummary(
  show: string,
  start: { season: number; episode: number },
  end: {
    season: number;
    episode: number;
  },
) {
  const promptBase = `Provide a plot overview of the following subtitle transcripts, grouped by episode. Provide one or two paragraphs of information per episode. Focus on key events, and any character development. Preface episode numbers and titles with "## " to mark them as headers. \n\n Use the following format for each episode: ## Season Number, Episode Number, Title: \n Summary information. \n Key plot points of this episode. \n\nTranscript:\n`;
  const file = await fs.readFile(
    process.cwd() + "/app/data/seriesData.json",
    "utf-8",
  );
  const jsonData = JSON.parse(file);
  const showData = jsonData[show];

  let prompt = promptBase + `\n\n`;

  const slicedSeasons = Object.entries(showData).slice(
    start.season - 1,
    end.season,
  );

  const slicedEpisodesAndSeasons = slicedSeasons.map(
    ([key, data]: [key: string, data: any]) => {
      if (key === start.season.toString() && key === end.season.toString()) {
        return data.slice(start.episode - 1, end.episode);
      } else if (key === start.season.toString()) {
        return data.slice(start.episode - 1);
      } else if (key === end.season.toString()) {
        return data.slice(0, end.episode);
      } else {
        return data;
      }
    },
  );

  let season = start.season;
  let episode = start.episode;

  for (const seasonData of slicedEpisodesAndSeasons) {
    if (season !== start.season) {
      episode = 1;
    }
    for (const episodeData of seasonData) {
      const episodeTranscript = episodeData
        .map((item: { start: number; end: number; text: string }) => item?.text)
        .join(" ");
      prompt =
        prompt +
        `Season ${season}, Episode ${episode}: ${episodeTranscript} \n\n`;
      episode++;
    }
    season++;
  }

  console.info("Sending prompt to Gemini");

  const result = await model.generateContent(prompt);
  return result.response.text();
}
