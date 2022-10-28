"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
exports.updateTableInsertResult = exports.updateTableDeleteResult = exports.updateTableUpdateResult = exports.getCommentsForRound = exports.comments = exports.groupByRounds = exports.results = exports.getSchedules = exports.schedules = exports.getTable = exports.teams = void 0;
var _ = __importStar(require("lodash"));
var teams = [
    {
        name: 'Dinamo',
        PG: 13,
        GD: 24,
        points: 35
    },
    {
        name: 'Hajduk',
        PG: 13,
        GD: 10,
        points: 27
    },
    {
        name: 'Osijek',
        PG: 14,
        GD: 7,
        points: 24
    },
    {
        name: 'Slaven Belupo',
        PG: 14,
        GD: -10,
        points: 23
    },
    {
        name: 'Varaždin',
        PG: 14,
        GD: 0,
        points: 19
    },
    {
        name: 'Istra 1961',
        PG: 13,
        GD: -3,
        points: 14
    },
    {
        name: 'Šibenik',
        PG: 14,
        GD: -3,
        points: 13
    },
    {
        name: 'Lokomotiva',
        PG: 14,
        GD: -8,
        points: 13
    },
    {
        name: 'Rijeka',
        PG: 14,
        GD: -7,
        points: 12
    },
    {
        name: 'Gorica',
        PG: 13,
        GD: -10,
        points: 6
    }
];
exports.teams = teams;
var schedules = [
    {
        date: '26.10.',
        round: 4,
        team1: 'Hajduk',
        team2: 'Gorica'
    },
    {
        date: '28.10.',
        round: 15,
        team1: 'Šibenik',
        team2: 'Varaždin'
    },
    {
        date: '29.10.',
        round: 15,
        team1: 'Rijeka',
        team2: 'Istra 1961'
    },
    {
        date: '29.10.',
        round: 15,
        team1: 'Osijek',
        team2: 'Dinamo'
    },
    {
        date: '30.10.',
        round: 15,
        team1: 'Lokomotiva',
        team2: 'Hajduk'
    },
    {
        date: '30.10.',
        round: 15,
        team1: 'Gorica',
        team2: 'Slaven Belupo'
    },
];
exports.schedules = schedules;
var results = [
    {
        date: '23.10.',
        round: 14,
        team1: 'Slaven Belupo',
        team2: 'Rijeka',
        goals1: 2,
        goals2: 1
    },
    {
        date: '23.10.',
        round: 14,
        team1: 'Istra 1961',
        team2: 'Šibenik',
        goals1: 0,
        goals2: 0
    },
    {
        date: '22.10.',
        round: 14,
        team1: 'Varaždin',
        team2: 'Osijek',
        goals1: 4,
        goals2: 1
    },
    {
        date: '22.10.',
        round: 14,
        team1: 'Lokomotiva',
        team2: 'Gorica',
        goals1: 2,
        goals2: 1
    },
    {
        date: '22.10.',
        round: 14,
        team1: 'Hajduk',
        team2: 'Dinamo',
        goals1: 1,
        goals2: 1
    },
    {
        date: '16.10.',
        round: 13,
        team1: 'Rijeka',
        team2: 'Lokomotiva',
        goals1: 3,
        goals2: 0
    },
    {
        date: '16.10.',
        round: 13,
        team1: 'Dinamo',
        team2: 'Varaždin',
        goals1: 3,
        goals2: 1
    },
    {
        date: '15.10.',
        round: 13,
        team1: 'Gorica',
        team2: 'Hajduk',
        goals1: 0,
        goals2: 1
    },
    {
        date: '15.10.',
        round: 13,
        team1: 'Osijek',
        team2: 'Istra 1961',
        goals1: 2,
        goals2: 0
    },
    {
        date: '14.10.',
        round: 13,
        team1: 'Šibenik',
        team2: 'Slaven Belupo',
        goals1: 0,
        goals2: 2
    }
];
exports.results = results;
var comments = [
    {
        date: new Date(),
        round: 14,
        author: 'klijent@mailinator.com',
        text: 'Izvrsno kolo. HŽV!!'
    },
    {
        date: new Date(),
        round: 14,
        author: 'ivan123@mailinator.com',
        text: 'Gazi gubu ajdeeeee'
    },
    {
        date: new Date(),
        round: 13,
        author: 'ivan123@mailinator.com',
        text: 'Svaka čast Rijeci.'
    },
    {
        date: new Date(),
        round: 13,
        author: 'klijent@mailinator.com',
        text: '#HŽV'
    }
];
exports.comments = comments;
function getTable() {
    teams.sort(function (a, b) {
        return b.points - a.points || b.GD - a.GD;
    });
    return teams;
}
exports.getTable = getTable;
function getSchedules() {
    schedules.sort(function (a, b) {
        return a.round - b.round;
    });
    return schedules;
}
exports.getSchedules = getSchedules;
function groupByRounds(arr) {
    var returnArr = _.groupBy(arr, 'round');
    return returnArr;
}
exports.groupByRounds = groupByRounds;
function getCommentsForRound(round) {
    return comments.filter(function (x) { return x.round === round; });
}
exports.getCommentsForRound = getCommentsForRound;
var updateTableUpdateResult = function (team1, team2, newTeam1, newTeam2, goals1, goals2, newGoals1, newGoals2) {
    updateTableDeleteResult(team1, team2, goals1, goals2);
    updateTableInsertResult(newTeam1, newTeam2, newGoals1, newGoals2);
};
exports.updateTableUpdateResult = updateTableUpdateResult;
var updateTableInsertResult = function (team1, team2, goals1, goals2) {
    var team1Idx = teams.findIndex(function (x) { return x.name === team1; });
    var team2Idx = teams.findIndex(function (x) { return x.name === team2; });
    teams[team1Idx].PG += 1;
    teams[team2Idx].PG += 1;
    var diff = goals1 - goals2;
    if (diff > 0) {
        teams[team1Idx].points += 3;
        teams[team1Idx].GD += diff;
        teams[team2Idx].GD -= diff;
    }
    else if (diff < 0) {
        teams[team2Idx].points += 3;
        teams[team1Idx].GD += diff;
        teams[team2Idx].GD -= diff;
    }
    else {
        teams[team1Idx].points += 1;
        teams[team2Idx].points += 1;
    }
};
exports.updateTableInsertResult = updateTableInsertResult;
var updateTableDeleteResult = function (team1, team2, goals1, goals2) {
    var team1Idx = teams.findIndex(function (x) { return x.name === team1; });
    var team2Idx = teams.findIndex(function (x) { return x.name === team2; });
    teams[team1Idx].PG -= 1;
    teams[team2Idx].PG -= 1;
    var diff = goals1 - goals2;
    if (diff > 0) {
        teams[team1Idx].points -= 3;
        teams[team1Idx].GD -= diff;
        teams[team2Idx].GD += diff;
    }
    else if (diff < 0) {
        teams[team2Idx].points -= 3;
        teams[team1Idx].GD -= diff;
        teams[team2Idx].GD += diff;
    }
    else {
        teams[team1Idx].points -= 1;
        teams[team2Idx].points -= 1;
    }
};
exports.updateTableDeleteResult = updateTableDeleteResult;
