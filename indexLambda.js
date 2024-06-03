module.exports.handler = async (event) => {
    const startTime = Date.now();
    const { file } = JSON.parse(event.body);
    const sorted = file.split('\n').sort();
    const endTime = Date.now();
    const finalTime = endTime - startTime;

    return {
        statusCode: 200,
        body: JSON.stringify({ time: finalTime })
    };
};
