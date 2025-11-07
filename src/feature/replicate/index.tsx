import {useRSocketStream} from "./useRSocketStream.ts";

const Replicate = () => {

    const {items} = useRSocketStream<{ id: string, content_url: string }>("replicate.image.stream");

    if (items.length === 0 || !items.some(it => it.content_url)) {
        return <div></div>
    }


    return (<div className="w-full h-full flex flex-col justify-center items-center gap-2">
        {
            items.map(item => (<img key={item.id} className="w-full flex-1" src={item.content_url} alt=""/>))
        }
    </div>)
}

export default Replicate;