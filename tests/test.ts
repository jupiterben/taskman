
async function s() {
    return 1;
}


function testQ() {
    s().then((i) => {
        console.log(i);
    });

    s().then((i) => {
        console.log(i);
    });
}

testQ();