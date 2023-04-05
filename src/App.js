import React, {useState} from 'react';
import {Stack, Spinner, Button, Badge} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Quotation from "./services/Quotation";
import Db from "./services/Db";
import ListStatistics from "./components/ListStatistics";
import QuotationCalculator from "./services/QuotationCalculator";

const urlWebsocket = "wss://trade.termplat.com:8800/?password=1234";
const defaultQuotations = 50;

let accumulator;

function App() {
    const [countQuotations, setCountQuotations] = useState(defaultQuotations);
    const [isStart, setIsStart] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [quoteCounter, setQuoteCounter] = useState(0);
    const [statistics, setStatistics] = useState([]);

    const quotation = new Quotation(urlWebsocket);
    const calculator = new QuotationCalculator();

    function start() {
        console.log(countQuotations);
        setIsStart(true);
        setIsLoading(true);
        quotation.startGetQuotations(setDataQuotation);
    }

    async function setDataQuotation(quotation){
        calculator.saveIntermediateData(quotation);
        accumulator = {...calculator.accum};

        setQuoteCounter(accumulator.quantity);

        if(countQuotations === accumulator.quantity){
            saveStatistic(await QuotationCalculator.calculate(accumulator))
        }
    }

    function saveStatistic(statistic) {
        // send data to save in DB
        Db.saveStatistic(statistic);
        setStatistics([...statistics, statistic]);
        setIsLoading(false);
    }

    async function getStatistics() {
        // send request for getting data from DB
        setIsLoading(true);

        const statisticsFromDb = await Db.getStatistics();
        console.dir({statisticsFromDb});

        console.dir({accumStatistics: accumulator});
        const lastStatistic = await QuotationCalculator.calculate(accumulator);
        console.dir({lastStatistic});
        Db.saveStatistic(lastStatistic);

        setStatistics([...statisticsFromDb, lastStatistic]);
        setIsLoading(false);
    }

    function changeInput(e) {
        const value = e.target.value;
        setCountQuotations(prev => /\d+/.test(Number(value)) ? Number(value) : prev);
    }

    return (
        <Stack gap={2} className="col-md-7 mx-auto">
            <Stack direction="horizontal" gap={4} className="mx-auto mb-3 mt-3">
                <input onChange={changeInput} value={countQuotations} type="text"/>
                <Button onClick={start} variant="success" disabled={isStart}>Start</Button>
                <Button onClick={getStatistics} variant="info">Statistics</Button>
            </Stack>
            <Stack direction="horizontal" gap={2} className="mx-auto">
                <h3>
                    Quotation counter:  <Badge bg="secondary">{quoteCounter}</Badge>
                </h3>
                {
                    isLoading &&
                    <Spinner animation="grow" className="mx-auto"/>
                }
            </Stack>
                {
                    statistics.length > 0 &&
                    <ListStatistics statistics={statistics}/>
                }
        </Stack>
    );
}

export default App;
