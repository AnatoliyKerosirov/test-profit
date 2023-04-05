import Statistic from "./Statistic";

export default class Accumulator extends Statistic{
    sum = 0;
    sumSqrt = 0;
    modeQuotes;
    uniqueQuotes;
    prevQuotesId = 0;

    constructor(){
        super();
        this.modeQuotes = new Map();
        this.uniqueQuotes = new Set();
    }
}