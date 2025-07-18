let pairingInProgress = false;
function matchOrWait(socket, waitingUsers, parejas, pvchatlogs, pairsids, updatepvchat, users) {
    if (pairingInProgress) {
        // Espera un poco y reintenta
        setTimeout(() => matchOrWait(socket, waitingUsers, parejas, pvchatlogs, pairsids, updatepvchat, users), 50);
        return;
    }

    pairingInProgress = true;

    if (waitingUsers.length > 0) {
        const pareja = waitingUsers.shift();

        // Prevención extra: no emparejar si es el mismo socket
        if (pareja.id === socket.id) {
            console.warn("¡Intento de emparejar usuario consigo mismo!");
            pairingInProgress = false;
            return;
        }

        parejas.set(socket.id, pareja.id);
        parejas.set(pareja.id, socket.id);

        socket.emit("matched");
        pareja.emit("matched");

        const pairid = [socket.id, pareja.id].sort().join("-");
        pairsids.set(socket.id, pairid);
        pairsids.set(pareja.id, pairid);

        pvchatlogs.set(pairid, [[
            "SERVER", "SERVER",
            `Has encontrado pareja! Han sido emparejados los usuarios ${users.get(socket.id).nickname} y ${users.get(pareja.id).nickname}. Vuestro pair id es: ${pairid}`
        ]]);

        console.log("USUARIOS EMPAREJADOS: PAIR ID :", pairid);

        updatepvchat(pvchatlogs.get(pairid));
    } else {
        waitingUsers.push(socket);
        socket.emit("waiting");
        console.log(socket.id + " - waiting user");
    }

    pairingInProgress = false;
}

module.exports = matchOrWait;