/**
 *@param {Ship} playerShip
 *@param {Entity} entity
 * @param {p5} p
 * @todo annotate return type
 */
function setupMyInputs(playerShip, entity, p) {
    //strudel already provides "mousex", but that is for the window not the canvas. we have more control here.

    //@ts-ignore
    const myStrudel = strudel;

    if (!playerShip) {
        throw new Error("setup playerShip before inputs, please");
    }
    const shipX = myStrudel.pure("unused").withValue((val) => {
        return p.map(playerShip.pos.x, 0, p.width, 0, 1, true);
    });

    const shipY = myStrudel.pure("unused").withValue((val) => {
        //note, inverted
        return p.map(playerShip.pos.y, 0, p.height, 1, 0, true);
    });
    const entityCloseness = myStrudel.pure("unused").withValue((val) => {
        const d = playerShip.pos.dist(entity.pos);
        return p.map(d, 0, 200, 1, 0, true);
    });

    const mouseXInput = myStrudel.pure("unused").withValue((val) => {
        return p.map(p.mouseX, 0, p.width, 0, 1, true);
    });

    return {
        shipX,
        shipY,
        mouseX: mouseXInput,
        entityCloseness,
    };
}
