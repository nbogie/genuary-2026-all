//@ts-check
function setupMyInputs() {
    //strudel already provides "mousex", but that is for the window not the canvas. we have more control here.

    if (!playerShip) {
        throw new Error("setup playerShip before inputs, please");
    }

    const shipX = myStrudel.pure("unused").withValue((val) => {
        return map(playerShip.pos.x, 0, width, 0, 1, true);
    });

    const shipY = myStrudel.pure("unused").withValue((val) => {
        //note, inverted
        return map(playerShip.pos.y, 0, height, 1, 0, true);
    });
    const entityCloseness = myStrudel.pure("unused").withValue((val) => {
        const d = playerShip.pos.dist(entity.pos);
        return map(d, 0, 200, 1, 0, true);
    });

    const mouseXInput = myStrudel.pure("unused").withValue((val) => {
        return map(mouseX, 0, width, 0, 1, true);
    });

    myInputs = {
        shipX,
        shipY,
        mouseX: mouseXInput,
        entityCloseness,
    };
}
