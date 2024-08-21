import { ShowList } from "@/app/actions";

interface ShowSelectorProps {
  showData?: ShowList;
  selectedShow: string | undefined;
  setSelectedShow: (arg0: string) => void;
}

export default function ShowSelector({
  showData,
  selectedShow,
  setSelectedShow,
}: ShowSelectorProps) {
  return (
    <>
      <label htmlFor="show-selector" className={"basis-1/3 font-bold"}>
        Select a show:
      </label>
      <select
        onChange={(event) => {
          setSelectedShow(event.target.value);
        }}
        name="show-selector"
        className="block w-full px-3 py-2 mb-2 text-sm font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        value={selectedShow || ""}
      >
        <option value={""} disabled>
          {showData ? "Select a show" : "Loading..."}
        </option>
        {showData?.shows?.map((show: any) => {
          return (
            <option key={show.title} value={show.title}>
              {show.title.substring(0, 1).toUpperCase() +
                show.title.substring(1)}
            </option>
          );
        })}
      </select>
    </>
  );
}
