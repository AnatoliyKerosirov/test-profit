const API_URL = "";
const API_KEY = "";

class Db {
    statistics = [];

    saveStatistic(statistic){
        this.sendRequestFake(`${API_URL}/statistics`, statistic)
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.error(err);
            });
    }

    async getStatistics(){
        try{
            const statisticsDb = await this.sendRequestFake(`${API_URL}/statistics`);
            return [...statisticsDb];
        }catch (err) {
            console.error(err);
        }
    }

    sendRequest(url, body, method = "POST"){
        return fetch(url, {
            method,
            "headers": {
                "api-key": API_KEY,
                "content-type": "application/json",
                "accept": "application/json"
            }, body: body ? JSON.stringify(body) : null
        })
    }

    async sendRequestFake(url, body, method = "POST"){
        if(body){
            this.statistics.push(body);
            return this.statistics;
        }
        return this.statistics;
    }
}

export default new Db();