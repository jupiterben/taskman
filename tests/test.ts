
async function s() {
    return 1;
}

console.log(process.env)
function testQ() {
    s().then((i) => {
        console.log(i);
    });

    s().then((i) => {
        console.log(i);
    });
}

testQ();