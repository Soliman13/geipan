import React from "react";
import { ResponsiveBarCanvas } from '@nivo/bar'
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveBarCanvas = ({data}) => (
    <ResponsiveBarCanvas
        data={data}
        keys={[
            '1 temoignage',
            '2 a 5 temoignages',
            '6 a 10 temoignages',
            '+ de 10 temoignages'
        ]}
        indexBy="annee"
        margin={{top: 50, right: 30, bottom: 50, left: 60}}
        pixelRatio={1.25}
        padding={0.25}
        innerPadding={0}
        minValue="auto"
        maxValue="auto"
        groupMode="stacked"
        layout="horizontal"
        reverse={false}
        colors={{scheme: 'red_blue'}}
        colorBy="id"
        borderWidth={0}
        borderColor={{from: 'color', modifiers: [['darker', 0.9]]}}
        axisTop={{tickSize: 5, tickPadding: 5, tickRotation: 0, legend: '', legendOffset: 36}}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Nombre de cas',
            legendPosition: 'middle',
            legendOffset: 36
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Années',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        axisRight={null}
        enableGridX={true}
        enableGridY={false}
        enableLabel={true}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{from: 'color', modifiers: [['darker', 0.9]]}}
        isInteractive={true}
    />
);

export default MyResponsiveBarCanvas;