import React from 'react';
import Table from 'react-bootstrap/Table';

function listStatistics({statistics}){

    const stats = [...statistics];

    const items = stats.map((stat, idx) => {
            return(
            <tr key={idx.toString()}>
                <td>{new Date(stat.timeStart).toLocaleString('ua-UK')}</td>
                <td>{stat.timeCalculations}</td>
                <td>{stat.quantity}</td>
                <td>{Math.round(stat.avg)}</td>
                <td>{Math.round(stat.standartDev)}</td>
                <td>{stat.mode}</td>
                <td>{stat.bid}</td>
                <td>{stat.ask}</td>
                <td>{stat.lostQuotations}</td>
            </tr>
            );
        }
    );

    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Start date, time</th>
                <th>Calculation time(ms)</th>
                <th>Quantity quotations</th>
                <th>Arithmetic mean</th>
                <th>Standard deviation</th>
                <th>Mode (popularity)</th>
                <th>Bid (maximum)</th>
                <th>Ask (minimum)</th>
                <th>Lost quotations</th>
            </tr>
            </thead>
            <tbody>
                { items }
            </tbody>
        </Table>
    )
}

export default listStatistics;