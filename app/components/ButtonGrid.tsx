"use client";
import React, { useEffect, useState } from "react";

interface ButtonGridProps {
  data: number[];
  setRange?: any;
}

interface SelectedRange {
  colIndex: number;
  rowIndex: number;
}

function ButtonGrid({ data, setRange }: ButtonGridProps) {
  const [selectedRange, setSelectedRange] = useState<SelectedRange[]>([]);

  useEffect(() => {
    if (!selectedRange?.length) {
      setRange(null);
      return;
    }
    const rangeData = {
      start: {
        season: selectedRange[0].colIndex + 1,
        episode: selectedRange[0].rowIndex + 1,
      },
      end: {
        season: selectedRange[selectedRange.length - 1].colIndex + 1,
        episode: selectedRange[selectedRange.length - 1].rowIndex + 1,
      },
    };
    setRange(rangeData);
  }, [selectedRange]);

  const handleClick = (colIndex: number, rowIndex: number) => {
    if (selectedRange.length === 0) {
      // First button click
      setSelectedRange([{ colIndex, rowIndex }]);
    } else {
      // Second button click
      const [start] = selectedRange;
      const end = { colIndex, rowIndex };

      const newSelectedRange: SelectedRange[] = [];
      for (let i = start.colIndex; i <= end.colIndex; i++) {
        const startRow = i === start.colIndex ? start.rowIndex : 0;
        const endRow = i === end.colIndex ? end.rowIndex : data[i] - 1;
        for (let j = startRow; j <= endRow; j++) {
          newSelectedRange.push({ colIndex: i, rowIndex: j });
        }
      }
      setSelectedRange(newSelectedRange);
    }
  };

  return (
    <div>
      <label htmlFor="first_name" className={"font-bold w-full align-middle"}>
        Select Episodes:
      </label>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-none gap-4">
          {data?.map((numRows, colIndex) => (
            <div key={colIndex} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                {" "}
                {/* Inline container */}
                <div className="text-lg font-semibold basis-1/6">
                  Season {colIndex + 1}
                </div>
                <div className="flex-col space-y-2 space-x-2">
                  {[...Array(numRows)].map((_, rowIndex) => (
                    <button
                      key={`${colIndex}-${rowIndex}`}
                      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                        selectedRange.some(
                          (range) =>
                            range.colIndex === colIndex &&
                            range.rowIndex === rowIndex,
                        )
                          ? "bg-purple-500"
                          : ""
                      }`}
                      onClick={() => handleClick(colIndex, rowIndex)}
                    >
                      Episode {rowIndex + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ButtonGrid;
