import {useEffect, useRef, useState} from "react";

const SseViewer = () => {
    const [chunkList, setChunkList] = useState<string[]>([]);
    const [question, setQuestion] = useState<string>();
    const inputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        inputRef.current.focus();
    }, []);

    function send() {
        const es = new EventSource("http://localhost:3232/api/v1/chats?q=" + question);
        setChunkList(prev => [...prev, "\n\n"])
        setQuestion(undefined)

        es.onmessage = (e) => setChunkList(prev => [...prev, e.data]);
        es.onerror = () => {
            es.close();
        };
    }

    return (
        <div className={"flex flex-col w-full h-full gap-5"}
        >
            <div className={"flex flex-col w-full h-100 overflow-y-auto no-scroll"}>
                <p className={"font-semibold"}>
                    {chunkList.join("\t")}
                </p>
            </div>
                <form action={send} className={"flex flex-col bg-[#737373FF] gap-1 justify-center w-full p-2 rounded-3xl"}>
                    <input className="text-white p-5 px-2 appearance-none border-0 bg-transparent focus:outline-none font-bold"
                           type="text"
                           ref={inputRef}
                           value={question ?? ""}
                           placeholder={"Send a message"}
                           onChange={e => setQuestion(e.currentTarget.value)}/>
                </form>
        </div>
    );
}

export default SseViewer;