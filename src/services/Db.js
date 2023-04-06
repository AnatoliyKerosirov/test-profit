const API_URL = "";
// const API_KEY = "";

class Db {
    statistics = [];

    saveStatistic(statistic){
        this.sendRequestFake(`${API_URL}/statistics`, 'POST', statistic)
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.error(err);
            });
    }

    async getStatistics(numberRecords = 10){
        try{

            const statisticsDb = await this.sendRequestFake(`${API_URL}/statistics?numberRecords=${numberRecords}`, 'GET');
            return [...statisticsDb];
        }catch (err) {
            console.error(err);
        }
    }

    // sendRequest(url, body, method = "POST"){
    //     return fetch(url, {
    //         method,
    //         "headers": {
    //             "api-key": API_KEY,
    //             "content-type": "application/json",
    //             "accept": "application/json"
    //         }, body: body ? JSON.stringify(body) : null
    //     })
    // }

    async sendRequestFake(url, method, body){
        if(method === 'GET'){
            const numberRecords = url.split('numberRecords=')[1];
            return this.statistics.filter((stat, idx, arr) => idx >= arr.length - numberRecords);
        }
        if(method === 'POST' && body){
            return this.statistics.push(body);
        }
    }
}

export default new Db();