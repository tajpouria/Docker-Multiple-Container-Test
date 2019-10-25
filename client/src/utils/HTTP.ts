export abstract class HTTP {
    abstract prefix: string;

    public get(url: string) {
        return fetch(`${this.prefix}${url}`).then(async res => {
            try {
                return await res.json();
            } catch (err) {
                console.error(`client: GET request failed \n${err}`);
            }
        });
    }

    public post(url: string, body: { [key: string]: any }) {
        fetch(`${this.prefix}${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body ? JSON.stringify(body) : undefined
        }).then(async res => {
            try {
                return await res.json();
            } catch (err) {
                console.error(`client: POST request failed \n${err}`);
            }
        });
    }
}
