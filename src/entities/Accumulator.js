export default class Accumulator {

    avg = 0; // arithmetical mean
    standartDev = 0; // standard deviation
    mode = 0;
    ask = 0; // min
    bid = 0; // max
    lostQuotations = 0;
    quantity = 0; // number of quotes
    timeStart = 0;
    timeCalculations = 0;

    sum = 0;
    sumSqrt = 0;
    modeQuotes = new Map();
    uniqueQuotes = new Set();
    prevQuotesId = 0;

}