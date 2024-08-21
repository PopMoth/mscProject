const fs = require('fs');
const path = require('path');

const arcaneSrtDirectoryPath = path.join(__dirname, 'srt_files/arcane');

const breakingBadSrtDirectoryPath = path.join(__dirname, 'srt_files/breaking-bad');

const outputFilePath = path.join(__dirname, 'app/data/seriesData.json');

const arcaneFileList = fs.readdirSync(arcaneSrtDirectoryPath);
const arcaneSrtFiles = arcaneFileList.filter(file => path.extname(file) === '.srt');
const arcaneSeriesArray = [];

arcaneSrtFiles.forEach(file => {
    const srtFilePath = path.join(arcaneSrtDirectoryPath, file);

    const data = fs.readFileSync(srtFilePath, 'utf8');
    const subtitles = data.split('\r\n\r\n').map(block => {
        const [idx, time, ...text] = block.split('\r\n');
        if (!idx) {
            return;
        }
        const [start, end] = time.split(' --> ');
        return {
            start,
            end,
            text: text.join('\n')
        };
    });
    arcaneSeriesArray.push(subtitles);
});

let i = 1;
const breakingBadSeriesArray = {};

while(i <= 5) {
    const breakingBadFileList = fs.readdirSync(breakingBadSrtDirectoryPath + '/' + i);
    const breakingBadSrtFiles = breakingBadFileList.filter(file => path.extname(file) === '.srt');
    const breakingBadSeasonArray = [];

    breakingBadSrtFiles.forEach(file => {
        const srtFilePath = path.join(breakingBadSrtDirectoryPath + '/' + i, file);

        const data = fs.readFileSync(srtFilePath, 'utf8');

        const subtitles = data.split(/\n{2,}/g).map(block => {
            const [idx, time, ...text] = block.split('\n');
            if (!idx) {
                return;
            }
            const [start, end] = time.split(' --> ');
            return {
                start,
                end,
                text: text.join('\n')
            };
        });
        breakingBadSeasonArray.push(subtitles);
    });
    breakingBadSeriesArray[i.toString()] = breakingBadSeasonArray;
    i++;
}


const jsonOutput = JSON.stringify({arcane: {1: arcaneSeriesArray}, breakingBad: breakingBadSeriesArray}, null, 2);
fs.writeFile(outputFilePath, jsonOutput, 'utf8', (err) => {
    if (err) {
        console.error('Error writing the JSON file:', err);
        return;
    }
    console.log('JSON file has been saved.');
});