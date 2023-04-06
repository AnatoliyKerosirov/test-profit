class Quotation {
    url;
    socket;

    constructor(url){
        this.url = url;
    }

    startGetQuotations(setDataQuotation){
        this.socket = new WebSocket(this.url);
        this.socket.onmessage = (e) => this.getQuotations(e, setDataQuotation);
    }

    getQuotations(event, setDataQuotation){
        const quotation = JSON.parse(event.data);
        setDataQuotation(quotation);
    }
}

export default Quotation;
