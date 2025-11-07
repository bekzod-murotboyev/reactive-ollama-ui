import {type FormEvent, useEffect, useRef, useState} from "react";
import {needsSpace, normalizeStreamChunk} from "../../util/common-utils.ts";

type ChunkMap = Map<string, string>;

const SseViewer = () => {
    const [chunkMap, setChunkMap] = useState<ChunkMap>(new Map());
    const [question, setQuestion] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    function send(e: FormEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (!question) return;

        // Capture the key before clearing the input to avoid the stale-closure bug
        const key = question;

        // Init entry
        setChunkMap(prev => {
            const next = new Map(prev);
            next.set(key, "");
            return next;
        });

        setQuestion("");

        const es = new EventSource(
            "http://localhost:3232/api/v1/chats/openai/streaming?q=" + encodeURIComponent(key)
        );

        es.onmessage = (ev) => {
            let data = normalizeStreamChunk(ev.data)

            setChunkMap(prev => {
                const next = new Map(prev);
                const prevStr = next.get(key) ?? "";

                if (needsSpace(prevStr, data)) {
                    data = " " + data;
                }

                next.set(key, prevStr + data);
                return next;
            });
        };


        es.onerror = () => {
            es.close();
        };
    }

    return (
        <div className="flex flex-col w-full h-fit gap-5">
            <div className="flex flex-col w-full h-[80vh] overflow-y-auto no-scroll">
                {Array.from(chunkMap.entries()).map(([q, answer]) => (
                    <div key={q} className="flex flex-col gap-2 mb-6">
                        <div className="flex justify-start">
                            <p className="text-left font-semibold whitespace-pre-wrap max-w-3/5">
                                {q}
                            </p>
                        </div>
                        <div className="flex justify-end">
                            <p className="font-semibold whitespace-pre-wrap break-words max-w-3/5 text-left">
                                {answer
                                        .replace(/ /g, " ")
                                        .replace(/\u202F/g, " ")
                                    || "..."}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <form
                onSubmit={send}
                className="flex flex-col bg-[#737383FF] gap-1 justify-center w-full p-2 rounded-3xl h-fit"
            >
                <input
                    className="text-white p-2 appearance-none border-0 bg-transparent focus:outline-none font-semibold"
                    ref={inputRef}
                    value={question}
                    placeholder="Send a message"
                    onChange={e => setQuestion(e.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                />
            </form>
        </div>
    );
};

export default SseViewer;
