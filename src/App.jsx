import "./index.css";
import { createContext, useState } from "react";
import { Rater } from "./helpers/Rater";
import Code from "./components/Code";
import Upload from "./components/Upload";
import Score from "./components/Score";
import Rate from "./components/Rate";

export const AppContext = createContext(undefined);

function App() {
  const [data, setData] = useState({ title: "", text: [], spaces: [] });
  const [isRated, setIsRated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rater, setRater] = useState(undefined);
  const [results, setResults] = useState({});
  const [score, setScore] = useState(75);
  const [totalMinus, setTotalMinus] = useState([]);
  const [minus, setMinus] = useState(undefined);
  const [highlighted, setHighlighted] = useState(undefined);
  const [selectedMetric, setSelectedMetric] = useState("");

  const resetState = () => {
    setRater(undefined);
    setResults({});
    setScore(100);
    setTotalMinus([]);
    setMinus(undefined);
    setHighlighted(undefined);
    setIsRated(false);
    setSelectedMetric("");
  };

  const showFile = async (event) => {
    resetState();
    event.preventDefault();
    if (event.target.files.length == 0) return;
    setData((prev) => ({ ...prev, title: event.target.files[0].name }));
    const reader = new FileReader();
    reader.onload = async (e) => {
      const newRater = new Rater(e.target.result);
      setRater(newRater);
      let result = e.target.result.split("\n");
      let spaces = result.map((line) => line.length - line.trimStart().length);
      setData((prev) => ({ ...prev, text: result, spaces }));
    };
    reader.readAsText(event.target.files[0]);
  };

  const rateCode = async () => {
    if (!rater) return;
    setIsLoading(true);
    const results = await rater.analyseCode();
    evaluateScore(results);
    setResults(results);
    setIsRated(true);
    setIsLoading(false);
  };

  const evaluateScore = (results) => {
    const res = [];
    let score = 100;

    const sum = results.longFuncs.reduce((acc, func) => {
      return acc + func[2];
    }, 0);

    let average = sum / results.longFuncs.length;

    const nestingScore = results.nestingLines.reduce((acc, func) => {
      return acc + func[1];
    }, 0);

    res.push(results.inheritances.length * 20);
    res.push(nestingScore);
    res.push(isNaN(average) ? 0 : average);

    score -= res.reduce((acc, value) => {
      return acc + value;
    }, 0);

    setTotalMinus(res);
    setScore(score);
  };

  const showNesting = () => {
    setSelectedMetric("Nesting");
    let hashset = new Set();
    results.nestingLines.forEach((line) => hashset.add(line[0]));
    setHighlighted(hashset);
    let map = new Map();
    results.nestingLines.map((line) => map.set(line[0], line[1]));
    setMinus(map);
  };

  const showFunctions = () => {
    setSelectedMetric("Functions");
    let hashset = new Set();
    results.longFuncs.forEach((res) => {
      for (let i = res[0]; i < res[1]; i++) {
        hashset.add(i);
      }
    });
    setHighlighted(hashset);
    let map = new Map();
    results.longFuncs.map((data) => map.set(data[0], data[2]));
    setMinus(map);
  };

  const showInheritance = () => {
    setSelectedMetric("Inheritance");
    let hashset = new Set();
    results.inheritances.forEach((line) => hashset.add(line));
    setHighlighted(hashset);
    let map = new Map();
    results.inheritances.map((index) => map.set(index, 20));
    setMinus(map);
  };

  const allData = {
    data,
    setData,
    isRated,
    setIsRated,
    isLoading,
    setIsLoading,
    rater,
    setRater,
    results,
    setResults,
    score,
    setScore,
    totalMinus,
    setTotalMinus,
    minus,
    setMinus,
    highlighted,
    setHighlighted,
    selectedMetric,
    setSelectedMetric,
    showFile,
    rateCode,
  };

  return (
    <>
      <AppContext.Provider value={allData}>
        <section className="!text-sm sm:text-base mx-auto flex justify-center items-center flex-col gap-4 py-4">
          {isRated && <Score />}

          <h1 className="font-medium text-2xl">{data.title}</h1>

          {data.title && !isRated && <Rate />}

          {isRated && (
            <div className="flex justify-center items-center gap-2 sm:gap-6 mt-4 mb-6">
              {[
                ["Inheritance", showInheritance],
                ["Nesting", showNesting],
                ["Functions", showFunctions],
              ].map((topic, index) => {
                return (
                  <div key={index} className="relative">
                    <button
                      onClick={() => topic[1]()}
                      className={`bg-green-500 text-white px-4 py-1 hover:cursor-pointer hover:bg-green-400 ${
                        selectedMetric == topic[0]
                          ? "border border-green-800"
                          : ""
                      }`}
                    >
                      {topic[0]}
                    </button>
                    <p className="font-medium text-red-500 absolute left-[45%] -translate-x-2/4 z-99 top-full">
                      - {totalMinus[index]}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <Code />
          <Upload />
        </section>
      </AppContext.Provider>
    </>
  );
}

export default App;