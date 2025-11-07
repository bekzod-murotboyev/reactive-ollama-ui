import {useEffect, useMemo, useState} from "react";
import {IdentitySerializer, JsonSerializer, RSocketClient} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client";

export function useRSocketStream<T>(route: string, requestData: unknown = null) {
    const [items, setItems] = useState<T[]>([]);
    const [error, setError] = useState<string | null>(null);


    const client = useMemo(() => new RSocketClient({
        serializers: {
            data: JsonSerializer,
            metadata: IdentitySerializer
        },
        setup: {
            keepAlive: 90000,
            lifetime: 180000,
            dataMimeType: 'application/json',
            metadataMimeType: 'application/json',
        },
        transport: new RSocketWebSocketClient({url: "ws://localhost:3232/rsocket"}),
    }), []);

    useEffect(() => {
        client.connect().subscribe({
            onComplete: (socket) => {
                socket
                    .requestStream({metadata: route})
                    .subscribe({
                        onSubscribe: subscription => {
                            subscription.request(2147483646)
                        },
                        onNext: ({data}) => {
                            console.log(data)
                            setItems(prev => [...prev, data])
                        },
                        onError: e => setError(String(e?.message ?? e)),
                        onComplete: () => console.log("done"),
                    })
            },
            onError: err => console.error("Connection failed", err),
        });

        return () => {
            client.close()
        }

    }, [client, requestData, route])


    return {items, error};
}
