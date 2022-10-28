import * as _ from 'lodash';
declare type Team = {
    name: string;
    PG: number;
    GD: number;
    points: number;
};
declare type Schedule = {
    date: string;
    round: number;
    team1: string;
    team2: string;
};
declare type Result = {
    date: string;
    round: number;
    team1: string;
    team2: string;
    goals1: number;
    goals2: number;
};
declare type Comment = {
    date: Date;
    round: number;
    author: string;
    text: string;
};
declare var teams: Array<Team>;
declare var schedules: Array<Schedule>;
declare var results: Array<Result>;
declare var comments: Array<Comment>;
declare function getTable(): Array<Team>;
declare function getSchedules(): Array<Schedule>;
declare function groupByRounds(arr: Array<Schedule> | Array<Result>): _.Dictionary<Schedule[] | Result[]>;
declare function getCommentsForRound(round: number): Array<Comment>;
declare var updateTableUpdateResult: (team1: string, team2: string, newTeam1: string, newTeam2: string, goals1: number, goals2: number, newGoals1: number, newGoals2: number) => void;
declare var updateTableInsertResult: (team1: string, team2: string, goals1: number, goals2: number) => void;
declare var updateTableDeleteResult: (team1: string, team2: string, goals1: number, goals2: number) => void;
export { Team, teams, Schedule, Result, Comment, getTable, schedules, getSchedules, results, groupByRounds, comments, getCommentsForRound, updateTableUpdateResult, updateTableDeleteResult, updateTableInsertResult };
