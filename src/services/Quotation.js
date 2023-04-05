export default class Quotation {
    url;

    constructor(url){
        this.url = url;
    }

    startGetQuotations(setDataQuotation){
        const socket = new WebSocket(this.url);
        socket.onmessage = (e) => this.getQuotations(e, setDataQuotation);
    }

    getQuotations(event, setDataQuotation){
        const quotation = JSON.parse(event.data);

        setDataQuotation(quotation);
    }
}
