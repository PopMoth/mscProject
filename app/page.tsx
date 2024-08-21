"use client";
import React, { useEffect, useState } from "react";
import ButtonGrid from "./components/ButtonGrid";
import { getShowList, getShowSummary, ShowList } from "@/app/actions";
import { remark } from "remark";
import html from "remark-html";
import ShowSelector from "@/app/components/ShowSelector";
import SummariseButton from "@/app/components/SummariseButton";
import SummaryView from "@/app/components/SummaryView";
import ResetButton from "@/app/components/ResetButton";

export default function Home() {
  const [showData, setShowData] = useState<ShowList>();
  const [selectedShow, setSelectedShow] = useState<string>();
  const [gridData, setGridData] = useState<number[]>([]);
  const [selectedRange, setSelectedRange] = useState<
    | {
        start: { season: number; episode: number };
        end: { season: number; episode: number };
      }
    | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>("");

  useEffect(() => {
    fetchShowData();
  }, []);

  useEffect(() => {
    if (selectedShow) {
      const data = showData?.shows?.find(
        (show: any) => show.title === selectedShow,
      );
      setGridData(
        data?.seasons.map((season: any) => season.episodeCount) || [],
      );
    }
  }, [selectedShow]);

  async function fetchShowData() {
    setShowData(await getShowList());
  }

  async function getSummary() {
    if (!selectedShow || !selectedRange) return;
    setIsLoading(true);
    const summary = await getShowSummary(
      selectedShow,
      selectedRange.start,
      selectedRange.end,
    );
    setIsLoading(false);

    const htmlSummary = (await remark().use(html).process(summary)).toString();
    setSummary(htmlSummary);
  }

  function resetPage() {
    setSelectedShow(undefined);
    setSelectedRange(undefined);
    setSummary("");
  }

  return (
    <main className="min-h-screen p-12 flex flex-col max-w-6xl m-auto place-items-center">
      <h1 className={"text-2xl font-bold mb-14"}>
        {summary ? `Summary` : `Search, Select, Summarise`}
      </h1>
      <div
        className={`w-full flex  w-1/2 place-items-top duration-1000 ${summary || isLoading ? "opacity-0 h-0" : "opacity-100 mb-10"}`}
      >
        <ShowSelector
          showData={showData}
          selectedShow={selectedShow}
          setSelectedShow={setSelectedShow}
        ></ShowSelector>
      </div>

      {/* Grid filled out with media info, IE if 3 seasons of 8 episodes below should be generated EG : <ButtonGrid data={[8,8,8]} */}
      <span
        className={`duration-1000 ${selectedShow && !summary && !isLoading ? "opacity-100 mb-10" : "opacity-0 h-0"}`}
      >
        <ButtonGrid data={gridData} setRange={setSelectedRange} />
      </span>

      {/* Get buttons from buttongrid to tell gemini what episodes to summarise, feed gem subtitles */}

      <span className={`${summary ? "mb-10" : ""}`}>
        <SummaryView summary={summary} />
      </span>
      <span className={`z-50`}>
        {summary ? (
            <ResetButton onClick={resetPage}/>
        ) : (
            <SummariseButton
            disabled={!selectedRange || isLoading}
            onClick={getSummary}
            isLoading={isLoading}
            />
        )}
      </span>
    </main>
  );
}
