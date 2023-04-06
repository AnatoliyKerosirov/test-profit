import Accumulator from "../entities/Accumulator";

class QuotationCalculator {
    accum = new Accumulator();

    setTimeStart(accum){
        accum.timeStart = new Date().getTime();
    }

    setTimeCalculate(accum){
        accum.timeCalculations = new Date().getTime() - accum.timeStart;
    }

    async calculate(accum){
        this.setTimeStart(accum);
        await this.calcStandartDev(accum);
        await this.calcMode(accum);
        this.setTimeCalculate(accum);
        return accum;
    }

    async calcStandartDev(accum){
        const numerator = accum.sumSqrt - 2 * accum.avg * accum.sum + accum.quantity * Math.pow(accum.avg, 2);
        const denominator = accum.quantity - 1;
        accum.standartDev = Math.sqrt(numerator / denominator);
    }

    async calcMode(accum){
        if(accum.modeQuotes.size === 0){
            accum.mode = [...accum.uniqueQuotes.keys()][0];
            return;
        }
        const maxMode = await [...accum.modeQuotes.entries()].reduce((acc, val) => {
            return val[1] > acc[1] ? val : acc;
        });
        accum.mode = maxMode[0];
    }

    saveIntermediateData(quote){
        let {id, value} = quote;

        if(typeof value !== 'number' || isNaN(value) || !id)
            return;

        if(this.accum.prevQuotesId > 0 && ++this.accum.prevQuotesId !== id){
            this.accum.lostQuotations += id - this.accum.prevQuotesId;
        }

        this.accum.prevQuotesId = id;

        this.accum.quantity++;
        this.calcMin(value);
        this.calcMax(value);
        this.calcAvgVolume(value);
        this.setDataForCalculateStandartDev(value);
        this.setDataForCalculateMode(value);
    }

    calcAvgVolume(value){
        this.accum.avg = (this.accum.avg * (this.accum.quantity - 1) + value) / (this.accum.quantity);
    }

    calcMin(value){
        if(this.accum.ask === 0){
            this.accum.ask = value;
            return;
        }
        if(this.accum.ask > value)
            this.accum.ask =  value;
    }

    calcMax(value){
        if(this.accum.bid < value)
            this.accum.bid = value;
    }

    setDataForCalculateStandartDev(value){
        this.accum.sum += value;
        this.accum.sumSqrt += Math.pow(value, 2);
    }

    setDataForCalculateMode(value){
        if(this.accum.uniqueQuotes.has(value)){
            this.accum.uniqueQuotes.delete(value);
            this.accum.modeQuotes.set(value, 1);
            return;
        }
        if(this.accum.modeQuotes.has(value)){
            this.accum.modeQuotes.set(value, this.accum.modeQuotes.get(value) + 1);
            return;
        }
        this.accum.uniqueQuotes.add(value);
    }
}

export default new QuotationCalculator();