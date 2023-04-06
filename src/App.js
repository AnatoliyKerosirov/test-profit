import React, {useState} from 'react';
import {Stack, Spinner, Button, Badge} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Quotation from "./services/Quotation";
import Calculator from "./services/QuotationCalculator";
import Db from "./services/Db";
import ListStatistics from "./components/ListStatistics";

const urlWebsocket = "wss://trade.termplat.com:8800/?password=1234";
const defaultNumberOfQuotations = 100;
const numberLastRecordsFromDB = 10;

let accumulatorCurrentData;
const quotation = new Quotation(urlWebsocket);

function App() {
    const [countQuotations, setCountQuotations] = useState(defaultNumberOfQuotations);
    const [isStart, setIsStart] = useState(false);
    const [isStatistics, setIsStatistics] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [quoteCounter, setQuoteCounter] = useState(0);
    const [statistics, setStatistics] = useState([]);

    function start() {
        setIsStart(true);
        if(countQuotations === 0){
            setCountQuotations(defaultNumberOfQuotations);
        }
        quotation.startGetQuotations(setDataQuotation);
    }

    async function setDataQuotation(quotation){
        Calculator.saveIntermediateData(quotation);
        accumulatorCurrentData = {...Calculator.accum};

        setQuoteCounter(accumulatorCurrentData.quantity);

        const count = countQuotations || defaultNumberOfQuotations;
        if(accumulatorCurrentData.quantity % count === 0){
            saveStatistic(await Calculator.calculate(accumulatorCurrentData));
        }
    }

    function saveStatistic(statistic) {
        Db.saveStatistic(statistic);
        if(!isStatistics){
            setIsStatistics(true);
        }
    }

    async function getStatistics() {
        setIsLoading(true);
        const currentData = {...accumulatorCurrentData};
        const lastStatistic = await Calculator.calculate(currentData);

        const statisticsFromDb = await Db.getStatistics(numberLastRecordsFromDB);

        setStatistics([...statisticsFromDb, lastStatistic]);
        setIsLoading(false);
    }

    function changeInput(e) {
        const value = e.target.value;
        setCountQuotations(prev => /\d+/.test(Number(value)) ? Number(value) : prev);
    }

    function stop(){
        if(quotation.socket && quotation.socket.readyState === 1){
            quotation.socket.close();
            setIsStart(false);
            setIsStatistics(false);
        }
    }

    return (
        <Stack gap={2} className="col-md-7 mx-auto">
            <Stack className="mx-auto fixed-top bg-light">
                <Stack direction="horizontal" gap={4} className="mx-auto mb-2 mt-3">
                    <input
                        onChange={changeInput}
                        value={countQuotations}
                        type="text"
                        className="form-control"
                        title="Number of quotations"/>
                    <Button
                        onClick={start}
                        variant="outline-success"
                        disabled={isStart}
                    >Start</Button>
                    <Button
                        onClick={getStatistics}
                        variant="outline-info"
                        disabled={!isStatistics}
                    >Statistics</Button>
                    <Button
                        onClick={stop}
                        variant="outline-danger"
                        disabled={!isStart}
                    >Stop</Button>
                </Stack>
                <Stack direction="horizontal" gap={2} className="mx-auto">
                    <h5>
                        Quotation counter:  <Badge bg="secondary">{quoteCounter}</Badge>
                    </h5>
                    {
                        isLoading &&
                        <Spinner animation="grow" className="mx-auto"/>
                    }
                </Stack>
            </Stack>
            <Stack className="mt-5 pt-5">
                {
                    statistics.length > 0 &&
                    <ListStatistics statistics={statistics}/>
                }
            </Stack>
        </Stack>
    );
}

export default App;
