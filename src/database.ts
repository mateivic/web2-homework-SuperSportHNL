import * as _ from 'lodash'

type Team = {
    name: string,
    PG: number,
    GD: number,
    points: number
}

type Schedule = {
    date: string,
    round: number,
    team1: string,
    team2: string
}

type Result = {
    date: string
    round: number,
    team1: string,
    team2: string,
    goals1: number,
    goals2: number
}

type Comment = {
    date: Date,
    round: number,
    author: string,
    text: string
}


var teams: Array<Team> = [
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
]

var schedules: Array<Schedule> = [
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
]

var results: Array<Result> = [
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
]

var comments: Array<Comment> = [
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

]


function getTable(): Array<Team> {
    teams.sort((a, b) =>
        b.points - a.points || b.GD - a.GD);
    return teams;
}

function getSchedules(): Array<Schedule> {
    schedules.sort((a, b) =>
        a.round - b.round);
    return schedules;
}

function groupByRounds(arr: Array<Schedule> | Array<Result>): _.Dictionary<Schedule[] | Result[]> {
    var returnArr = _.groupBy(arr, 'round');
    return returnArr;

}

function getCommentsForRound(round: number): Array<Comment> {
    return comments.filter((x) => x.round === round);
}

var updateTableUpdateResult = function (team1: string, team2: string,
    newTeam1: string, newTeam2: string, goals1: number, goals2: number,
    newGoals1: number, newGoals2: number) {

    updateTableDeleteResult(team1, team2, goals1, goals2);
    updateTableInsertResult(newTeam1, newTeam2, newGoals1, newGoals2);

}

var updateTableInsertResult = function (team1: string, team2: string, goals1: number, goals2: number) {

    var team1Idx = teams.findIndex((x) => x.name === team1);
    var team2Idx = teams.findIndex((x) => x.name === team2);
    teams[team1Idx].PG += 1;
    teams[team2Idx].PG += 1;
    var diff: number = goals1 - goals2;
    if (diff > 0) {
        teams[team1Idx].points += 3;
        teams[team1Idx].GD += diff;
        teams[team2Idx].GD -= diff;
    } else if (diff < 0) {
        teams[team2Idx].points += 3;
        teams[team1Idx].GD += diff;
        teams[team2Idx].GD -= diff;
    } else {
        teams[team1Idx].points += 1;
        teams[team2Idx].points += 1;
    }
}


var updateTableDeleteResult = function (team1: string, team2: string, goals1: number, goals2: number) {

    var team1Idx = teams.findIndex((x) => x.name === team1);
    var team2Idx = teams.findIndex((x) => x.name === team2);
    teams[team1Idx].PG -= 1;
    teams[team2Idx].PG -= 1;
    var diff: number = goals1 - goals2;
    if (diff > 0) {
        teams[team1Idx].points -= 3;
        teams[team1Idx].GD -= diff;
        teams[team2Idx].GD += diff;
    } else if (diff < 0) {
        teams[team2Idx].points -= 3;
        teams[team1Idx].GD -= diff;
        teams[team2Idx].GD += diff;
    } else {
        teams[team1Idx].points -= 1;
        teams[team2Idx].points -= 1;
    }
}




export { Team, teams, Schedule, Result, Comment, getTable, schedules, getSchedules, results, groupByRounds, comments, getCommentsForRound, updateTableUpdateResult, updateTableDeleteResult, updateTableInsertResult };