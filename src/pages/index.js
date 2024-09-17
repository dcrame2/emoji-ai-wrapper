import { Textarea, Button, Snippet, Input } from "@nextui-org/react";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [emojis, setEmojis] = useState([]);
  const [numOfEmojis, setNumOfEmojis] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const emojisTest = [
    // "🧪🔬📊🔍📝📈📉📏📐🔩🧬🏷️📋📜🗂️🔎📅✏️🔗📊",
    // "🧪🔬📊🔍📝📈📉📏📐🔩🧬🏷️📋📜🗂️🔎📅✏️🔗📊📅✏️🔗📊📅✏️🔗📊",
    // "🧪🔬📊🔍📝📈📉📏📐🔩🧬🏷️📋📜🗂️🔎📅✏️🔗📊📊📊",
    // "🧪🔬🧬📊📈✅📝",
    // "🧪🔬🧫✅📊🔍",
    // "🧪🔬🧫✅📊🔍",
    // "🧪🔬🧫✅📊🔍",
    // "🧪🔬🧫✅📊🔍",
    // "🧪🔬🧫✅📊🔍",
    // "🧪🔬🧫✅📊🔍",
    // "🧪🔬🧫✅📊🔍",
    // "🧪🔬🧫✅📊🔍",
    // "🧪🔬🧫🧪🧬🔭⚗️🧪👩‍🔬👨‍🔬📊📈📉📝🔍",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/getEmojis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, numOfEmojis }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmojis((prevEmojis) => [...prevEmojis, data.emojis]);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to fetch emojis");
    } finally {
      setLoading(false);
    }
  };

  const handleClearEmojis = () => {
    setEmojis([]);
    setPrompt("");
  };

  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center py-10 px-4 md:px-8">
      <div className="w-full max-w-3xl p-4 bg-white shadow-lg overflow-auto rounded-lg">
        <h1 className="text-2xl text-black font-semibold text-center mb-4">
          Get Emojis from Prompt
        </h1>
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <Textarea
            label="Enter a description"
            className="w-full text-black text-base"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a sentence"
            required
            minRows={1}
            maxLength={500}
            variant="bordered"
          />
          <Input
            label="Number of emojis"
            type="number"
            value={numOfEmojis}
            onChange={(e) => setNumOfEmojis(e.target.value)}
            min="1"
            max="30"
            className="w-full text-black text-base"
            variant="bordered"
          />
          <div className="flex gap-2">
            <Button
              className="w-4/5 py-2 bg-blue-500 hover:bg-blue-600"
              color="primary"
              type="submit"
              isLoading={loading}
            >
              {loading ? "Generating..." : "Generate Emojis"}
            </Button>
            <Button
              className="w-1/5  py-2 bg-red-500 hover:bg-red-600"
              color="error"
              onClick={handleClearEmojis}
              isDisabled={emojis.length === 0}
            >
              Clear
            </Button>
          </div>
        </form>
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {emojis &&
            emojis.map((emoji, index) => (
              <Snippet
                key={index}
                hideSymbol
                className="p-3 bg-gray-100 rounded-md break-words whitespace-normal max-h-24 overflow-y-auto relative"
              >
                {emoji}
              </Snippet>
            ))}
        </div>
      </div>
    </div>
  );
}
