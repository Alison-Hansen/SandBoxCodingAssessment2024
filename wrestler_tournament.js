/**
 * @author Alison Hansen
 * File Name: wrestler_tournament.js
 * Date: 29 March, 2024
 * Assignment: SandBox Coding Assessment Summer/Fall 2024
 */

//Global variables
//Wrestlers - array of wrestler objects to fight in tournament
var Wrestlers = [
    {
        "name": "Wrestler A",
        "health": 100,
        "moves": [
            { "name": "Spear", "damage": 40, "type": "signature" },
            { "name": "Thunderous Kick", "damage": 20, "type": "signature" },
            { "name": "Finishing Move", "damage": 100, "type": "finisher" }
        ]
    },
    {
        "name": "Wrestler B",
        "health": 100,
        "moves": [
            { "name": "Dragon Sleeper", "damage": 45, "type": "signature" },
            { "name": "Elbow Drop", "damage": 15, "type": "signature" },
            { "name": "Finishing Move", "damage": 100, "type": "finisher" }
        ]
    },
    {
        "name": "Wrestler C",
        "health": 100,
        "moves": [
            { "name": "Chokeslam", "damage": 35, "type": "signature" },
            { "name": "Curb Stomp", "damage": 25, "type": "signature" },
            { "name": "Finishing Move", "damage": 100, "type": "finisher" }
        ]
    },
    {
        "name": "Wrestler D",
        "health": 100,
        "moves": [
            { "name": "Attitude Adjustment", "damage": 20, "type": "signature" },
            { "name": "Suplex", "damage": 40, "type": "signature" },
            { "name": "Finishing Move", "damage": 100, "type": "finisher" }
        ]
    }
];

//activeWrestlers - array of strings, holds the name of wrestlers who are currently in the tournament
var activeWrestlers = [];
//matchNumber - keeps track of the current match number
var matchNumber = 1;

/**
 * Pairs wrestlers together and starts fight
 * @returns false if at least 2 wrestlers are in tournament, true if only 1 wrestler remains (win condition)
 */
function pairWrestlers() {
    //get number of wrestlers currently in tournament
    let len = activeWrestlers.length;

    if (len == 4) {
        //start match between first 2 wrestlers in array
        console.log("Match " + matchNumber + ": " + activeWrestlers[0] + " vs. " + activeWrestlers[1]);
        let winner1 = fight(activeWrestlers[0], activeWrestlers[1]);

        //start match between last 2 wrestlers in array
        console.log("Match " + matchNumber + ": ", activeWrestlers[2] + " vs. " + activeWrestlers[3]);
        let winner2 = fight(activeWrestlers[2], activeWrestlers[3]);

        //set activeWrestlers from match results
        activeWrestlers = [winner1, winner2];

        return false;
    } else if (len == 3) {
        //start match between first 2 wrestlers in array
        console.log("Match " + matchNumber + ": " + activeWrestlers[0] + " vs. " + activeWrestlers[1]);
        let winner = fight(activeWrestlers[0], activeWrestlers[1]);

        //extra wrestler receives bye
        console.log(activeWrestlers[2], " receives a bye.");
        console.log("");
        let tempWrestler = activeWrestlers[2];

        //set activeWrestlers from match results
        activeWrestlers = [winner, tempWrestler];

        return false;
    } else if (len == 2) {
        //start match between the 2 wrestlers in array
        console.log("Match " + matchNumber + ": " + activeWrestlers[0] + " vs. " + activeWrestlers[1]);
        let winner = fight(activeWrestlers[0], activeWrestlers[1]);

        //set activeWrestlers from match results
        activeWrestlers = [winner];

        return false;
    } else {
        //if only one wrestler left, they win the tournament
        return true;
    }
}

/**
 * Executes a match between two wrestlers until one of the wrestlers reaches 0 health or below
 * @param wrestler1 the name of the first wrestler in the fight 
 * @param wrestler2 the name of the second wrestler in the fight 
 * @returns the name of the winner of the match
 */
function fight(wrestler1, wrestler2) {
    //match data
    let winner;
    let round = 1;

    //get wrestler data based on name
    let w1;
    let w2;
    for (let i = 0, len = Wrestlers.length; i < len; i++) {
        if (Wrestlers[i].name == wrestler1) {
            w1 = Wrestlers[i];
        }
        if (Wrestlers[i].name == wrestler2) {
            w2 = Wrestlers[i];
        }
    }

    //wrestler data
    let w1health = w1.health;
    let w2health = w2.health;
    let w1move;
    let w2move;
    let moveResult1;
    let moveResult2;

    //FIGHT! - each run through the while loop is one round of fighting
    while (w1health > 0 && w2health > 0) {
        console.log("Round " + round + ":");
        w1move = chooseMove(w1.moves);
        w2move = chooseMove(w2.moves);

        //wrestler 1 executes move
        moveResult1 = useMove(w1move, w2health);
        if (moveResult1 == "miss") {
            console.log(w1.name + " misses " + w1move.name + ".");
        } else if (moveResult1 <= 0) {
            console.log(w1.name + " performs " + w1move.name + " on " + w2.name + ". " + w2.name + "'s health: 0.");
            console.log(w2.name + "'s health is below 0. " + w1.name + " wins!");
            w2health = 0;
            winner = w1.name;
        } else {
            console.log(w1.name + " performs " + w1move.name + " on " + w2.name + ". " + w2.name + "'s health: " + moveResult1 + ".");
            w2health = moveResult1;
        }

        //check that wrestler 2 has at least 1 health
        if (w2health != 0) {
            //wrestler 2 executes move
            moveResult2 = useMove(w2move, w1health);
            if (moveResult2 == "miss") {
                console.log(w2.name + " misses " + w2move.name + ".");
            } else if (moveResult2 <= 0) {
                console.log(w2.name + " performs " + w2move.name + " on " + w1.name + ". " + w1.name + "'s health: 0.");
                console.log(w1.name + "'s health is below 0. " + w2.name + " wins!");
                w1health = 0;
                winner = w2.name;
            } else {
                console.log(w2.name + " performs " + w2move.name + " on " + w1.name + ". " + w1.name + "'s health: " + moveResult2 + ".");
                w1health = moveResult2;
            }
        }

        //increment round when round ends
        round++;
    }

    //increment matchNumber when fight ends
    matchNumber++;
    console.log("");

    //return winner of fight
    return winner;
}

/**
 * Selects a move at random from a wrestlers' moves array
 * @param moveSet array of moves taken from the wrestler object
 * @returns the single randomly selected move to be used
 */
function chooseMove(moveSet) {
    let len = moveSet.length;
    let move = Math.floor(Math.random() * len);
    return moveSet[move];
}

/**
 * Calculates the damage taken from a move, 
 * if move type is "finisher" & opponent health is above 45 the move has a 50% chance to fail
 * @param move the move to be used/executed
 * @param wrestlerHealth the health of the opposing wrestler (wrestler who takes damage)
 * @returns the opposing wrestler's health after taking damage from the move (if the move hits),
 *          "miss" if the move misses
 */
function useMove(move, wrestlerHealth) {
    if (move.type == "finisher" && wrestlerHealth > 45) {
        let chanceFail = Math.floor(Math.random() * 2);
        if (chanceFail == 1) {
            return (wrestlerHealth - move.damage);
        } else {
            return "miss";
        }
    } else {
        return (wrestlerHealth - move.damage);
    }
}

/**
 * Main funcion to start/run the tournament
 * @returns a string containing the winner of the tournament
 */
function startTournament() {
    //gather names of wrestlers from array of wrestler objects & add names to activeWrestlers
    for (let i = 0, len = Wrestlers.length; i < len; i++) {
        activeWrestlers.push(Wrestlers[i].name);
    }

    //run pairWrestlers() until it returns true (signifies tournament end)
    let tournamentStatus = false;
    while (tournamentStatus == false) {
        tournamentStatus = pairWrestlers();
    }

    //return status message about winner of tournament
    return `${activeWrestlers[0]} wins the tournament!`;
}

//startTournament() call
console.log(startTournament());