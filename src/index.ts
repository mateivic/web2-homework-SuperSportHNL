import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import * as db from './database';
import * as _ from 'lodash'
import { auth, requiresAuth } from 'express-openid-connect';
import * as dotenv from "dotenv";
import * as mid from "./auth-middleware";

dotenv.config();
const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4080;

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: externalUrl || `https://localhost:${port}`,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUERBASEURL
};

const app = express();
// app.use(auth.setUserInfo);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(auth(config));

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug');

app.get('/', function (req, res) {
    var rounds: string[] = _.keys(db.groupByRounds(db.results));
    res.render('index', {
        teams: db.getTable(),
        schedules: db.getSchedules(),
        rounds: rounds,
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
    });
});

app.get('/results/:round', function (req, res) {
    var round: string = req.params.round;
    var rounds: string[] = _.keys(db.groupByRounds(db.results));
    if (rounds.includes(round)) {
        var results = db.results.filter((x) => x.round === Number(round))
        res.render('results', {
            results: results,
            round: round,
            comments: db.getCommentsForRound(Number(round)),
            isAuthenticated: req.oidc.isAuthenticated(),
            user: req.oidc.user,
            isAdmin: req.oidc.user?.email === process.env.ADMIN
        });
    } else {
        res.status(404);
        res.end('Page not found');
    }
});

app.get('/results/deleteComment/:round/:time', requiresAuth(), function (req, res) {
    var round = req.params.round;
    var time = Number(req.params.time);
    var user: string = req.oidc.user?.email;
    var comment: db.Comment[] = db.comments.filter((x) => x.author === user &&
        x.round === Number(round) &&
        x.date.getSeconds() === time);
    if (comment.length === 1) {
        var index = db.comments.findIndex((x) => x.author === user &&
            x.round === Number(round) &&
            x.date.getSeconds() === time);
        db.comments.splice(index, 1);
        res.redirect("/results/" + round);
    } else {
        res.status(403);
        res.end('Forbidden');
    }


});

app.post('/results/:round', requiresAuth(), function (req, res) {
    var round: string = req.params.round;
    var text: string = req.body.comment;
    var comm: db.Comment =
    {
        date: new Date(),
        round: Number(round),
        author: req.oidc.user?.email,
        text: text
    };
    db.comments.push(comm);
    res.redirect("/results/" + round);
});


app.post('/changeComment/:round/:time', requiresAuth(), function (req, res) {
    var round = req.params.round;
    var time = Number(req.params.time);
    var user: string = req.oidc.user?.email;
    var newComment = req.body.newComment;
    var comment: db.Comment[] = db.comments.filter((x) => x.author === user &&
        x.round === Number(round) &&
        x.date.getSeconds() === time);
    if (comment.length === 1) {
        var index = db.comments.findIndex((x) => x.author === user &&
            x.round === Number(round) &&
            x.date.getSeconds() === time);
        db.comments[index].text = newComment;
        res.redirect("/results/" + round);
    } else {
        res.status(404);
        res.end('Not found');
    }

});


app.post('/editResult/:round', requiresAuth(), mid.requiresAdmin, function (req, res) {
    var round: Number = Number(req.params.round);
    if (db.results.filter((x) => x.round === round && x.team1 === req.body.team1 && x.team2 === req.body.team2).length === 1) {
        var index = db.results.findIndex((x) => x.round === round &&
            x.team1 === req.body.team1 &&
            x.team2 === req.body.team2);
        db.results[index].date = req.body.date;
        db.results[index].team1 = req.body.newTeam1;
        db.results[index].team2 = req.body.newTeam2;
        db.results[index].goals1 = req.body.newGoals1;
        db.results[index].goals2 = req.body.newGoals2;

        db.updateTableUpdateResult(req.body.team1, req.body.team2, req.body.newTeam1, req.body.newTeam2,
            req.body.goals1, req.body.goals2, req.body.newGoals1, req.body.newGoals2);
        res.redirect("/results/" + round);
    } else {
        res.status(404);
        res.end('Not found');
    }

});

app.post('/deleteResult/:round', requiresAuth(), mid.requiresAdmin, function (req, res) {
    var round = Number(req.params.round);
    if (db.results.filter((x) => x.round === round && x.team1 === req.body.team1 && x.team2 === req.body.team2).length === 1) {
        var index = db.results.findIndex((x) => x.round === round &&
            x.team1 === req.body.team1 &&
            x.team2 === req.body.team2);
        db.results.splice(index, 1);
        db.updateTableDeleteResult(req.body.team1, req.body.team2, req.body.goals1, req.body.goals2);
        res.redirect("/results/" + round);
    } else {
        res.status(404);
        res.end('Not found');
    }

});

app.post('/addResult/:round', requiresAuth(), mid.requiresAdmin, function (req, res) {
    var round: number = Number(req.params.round);
    var newResult: db.Result = {
        date: req.body.date,
        round: round,
        team1: req.body.team1,
        team2: req.body.team2,
        goals1: req.body.goals1,
        goals2: req.body.goals2
    };
    db.results.push(newResult);
    db.updateTableInsertResult(req.body.team1, req.body.team2, req.body.goals1, req.body.goals2);
    res.redirect("/results/" + round);
});


app.post('/adminDeleteComment/:round', requiresAuth(), mid.requiresAdmin, function (req, res) {
    var round: number = Number(req.params.round);
    if (db.comments.filter((x) => x.round === round && x.author === req.body.author
        && x.date.getSeconds() === Number(req.body.time)).length === 1) {

        var index = db.comments.findIndex((x) => x.round === round && x.author === req.body.author
            && x.date.getSeconds() === Number(req.body.time));
        db.comments.splice(index, 1);
        res.redirect("/results/" + round);
    } else {
        res.status(404);
        res.end('Not found');
    }
});

if (externalUrl) {
    const hostname = '127.0.0.1';
    app.listen(port, hostname, () => {
        console.log(`Server locally running at http://${hostname}:${port}/ and from
        outside on ${externalUrl}`);
    });
} else {
    https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
    }, app)
        .listen(port, function () {
            console.log(`Server running at https://localhost:${port}/`);
        });
}