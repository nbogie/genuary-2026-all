/**
 * @typedef {Object} MyInputs
 * @property {any} shipX
 * @property {any} shipY
 * @property {any} mouseX
 * @property {any} entityOrderCloseness
 * @property {any} entityChaosCloseness
 */
/**
 *@param {Ship} playerShip
 *@param {Entity} entity
 *@param {Entity} entityChaos
 * @param {p5} p
 * @return {MyInputs}
 */
function setupMyInputs(playerShip, entity, entityChaos, p) {
    //strudel already provides "mousex", but that is for the window not the canvas. we have more control here.

    if (!playerShip) {
        throw new Error("setup playerShip before inputs, please");
    }
    const shipX = strudel.pure("unused").withValue((val) => {
        return p.map(playerShip.pos.x, 0, p.width, 0, 1, true);
    });

    const shipY = strudel.pure("unused").withValue((val) => {
        //note, inverted
        return p.map(playerShip.pos.y, 0, p.height, 1, 0, true);
    });
    const entityOrderCloseness = strudel.pure("unused").withValue((val) => {
        const d = playerShip.pos.dist(entity.pos);
        return p.map(d, 0, 200, 1, 0, true);
    });

    const entityChaosCloseness = strudel.pure("unused").withValue((val) => {
        const d = playerShip.pos.dist(entityChaos.pos);
        return p.map(d, 0, 200, 1, 0, true);
    });

    const mouseXInput = strudel.pure("unused").withValue((val) => {
        return p.map(p.mouseX, 0, p.width, 0, 1, true);
    });

    return {
        shipX,
        shipY,
        mouseX: mouseXInput,
        entityOrderCloseness,
        entityChaosCloseness,
    };
}
