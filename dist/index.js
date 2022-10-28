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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var https_1 = __importDefault(require("https"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var db = __importStar(require("./database"));
var _ = __importStar(require("lodash"));
var express_openid_connect_1 = require("express-openid-connect");
var dotenv = __importStar(require("dotenv"));
var mid = __importStar(require("./auth-middleware"));
dotenv.config();
var externalUrl = process.env.RENDER_EXTERNAL_URL;
var port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4080;
var config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: externalUrl || "https://localhost:".concat(port),
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUERBASEURL
};
var app = (0, express_1["default"])();
// app.use(auth.setUserInfo);
app.use(express_1["default"].static('public'));
app.use(express_1["default"].urlencoded({ extended: true }));
app.use((0, express_openid_connect_1.auth)(config));
app.set("views", path_1["default"].join(__dirname, "views"));
app.set('view engine', 'pug');
app.get('/', function (req, res) {
    var rounds = _.keys(db.groupByRounds(db.results));
    res.render('index', {
        teams: db.getTable(),
        schedules: db.getSchedules(),
        rounds: rounds,
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
    });
});
app.get('/results/:round', function (req, res) {
    var _a;
    var round = req.params.round;
    var rounds = _.keys(db.groupByRounds(db.results));
    if (rounds.includes(round)) {
        var results = db.results.filter(function (x) { return x.round === Number(round); });
        res.render('results', {
            results: results,
            round: round,
            comments: db.getCommentsForRound(Number(round)),
            isAuthenticated: req.oidc.isAuthenticated(),
            user: req.oidc.user,
            isAdmin: ((_a = req.oidc.user) === null || _a === void 0 ? void 0 : _a.email) === process.env.ADMIN
        });
    }
    else {
        res.status(404);
        res.end('Page not found');
    }
});
app.get('/results/deleteComment/:round/:time', (0, express_openid_connect_1.requiresAuth)(), function (req, res) {
    var _a;
    var round = req.params.round;
    var time = Number(req.params.time);
    var user = (_a = req.oidc.user) === null || _a === void 0 ? void 0 : _a.email;
    var comment = db.comments.filter(function (x) { return x.author === user &&
        x.round === Number(round) &&
        x.date.getSeconds() === time; });
    if (comment.length === 1) {
        var index = db.comments.findIndex(function (x) { return x.author === user &&
            x.round === Number(round) &&
            x.date.getSeconds() === time; });
        db.comments.splice(index, 1);
        res.redirect("/results/" + round);
    }
    else {
        res.status(403);
        res.end('Forbidden');
    }
});
app.post('/results/:round', (0, express_openid_connect_1.requiresAuth)(), function (req, res) {
    var _a;
    var round = req.params.round;
    var text = req.body.comment;
    var comm = {
        date: new Date(),
        round: Number(round),
        author: (_a = req.oidc.user) === null || _a === void 0 ? void 0 : _a.email,
        text: text
    };
    db.comments.push(comm);
    res.redirect("/results/" + round);
});
app.post('/changeComment/:round/:time', (0, express_openid_connect_1.requiresAuth)(), function (req, res) {
    var _a;
    var round = req.params.round;
    var time = Number(req.params.time);
    var user = (_a = req.oidc.user) === null || _a === void 0 ? void 0 : _a.email;
    var newComment = req.body.newComment;
    var comment = db.comments.filter(function (x) { return x.author === user &&
        x.round === Number(round) &&
        x.date.getSeconds() === time; });
    if (comment.length === 1) {
        var index = db.comments.findIndex(function (x) { return x.author === user &&
            x.round === Number(round) &&
            x.date.getSeconds() === time; });
        db.comments[index].text = newComment;
        res.redirect("/results/" + round);
    }
    else {
        res.status(404);
        res.end('Not found');
    }
});
app.post('/editResult/:round', (0, express_openid_connect_1.requiresAuth)(), mid.requiresAdmin, function (req, res) {
    var round = Number(req.params.round);
    if (db.results.filter(function (x) { return x.round === round && x.team1 === req.body.team1 && x.team2 === req.body.team2; }).length === 1) {
        var index = db.results.findIndex(function (x) { return x.round === round &&
            x.team1 === req.body.team1 &&
            x.team2 === req.body.team2; });
        db.results[index].date = req.body.date;
        db.results[index].team1 = req.body.newTeam1;
        db.results[index].team2 = req.body.newTeam2;
        db.results[index].goals1 = req.body.newGoals1;
        db.results[index].goals2 = req.body.newGoals2;
        db.updateTableUpdateResult(req.body.team1, req.body.team2, req.body.newTeam1, req.body.newTeam2, req.body.goals1, req.body.goals2, req.body.newGoals1, req.body.newGoals2);
        res.redirect("/results/" + round);
    }
    else {
        res.status(404);
        res.end('Not found');
    }
});
app.post('/deleteResult/:round', (0, express_openid_connect_1.requiresAuth)(), mid.requiresAdmin, function (req, res) {
    var round = Number(req.params.round);
    if (db.results.filter(function (x) { return x.round === round && x.team1 === req.body.team1 && x.team2 === req.body.team2; }).length === 1) {
        var index = db.results.findIndex(function (x) { return x.round === round &&
            x.team1 === req.body.team1 &&
            x.team2 === req.body.team2; });
        db.results.splice(index, 1);
        db.updateTableDeleteResult(req.body.team1, req.body.team2, req.body.goals1, req.body.goals2);
        res.redirect("/results/" + round);
    }
    else {
        res.status(404);
        res.end('Not found');
    }
});
app.post('/addResult/:round', (0, express_openid_connect_1.requiresAuth)(), mid.requiresAdmin, function (req, res) {
    var round = Number(req.params.round);
    var newResult = {
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
app.post('/adminDeleteComment/:round', (0, express_openid_connect_1.requiresAuth)(), mid.requiresAdmin, function (req, res) {
    var round = Number(req.params.round);
    if (db.comments.filter(function (x) { return x.round === round && x.author === req.body.author
        && x.date.getSeconds() === Number(req.body.time); }).length === 1) {
        var index = db.comments.findIndex(function (x) { return x.round === round && x.author === req.body.author
            && x.date.getSeconds() === Number(req.body.time); });
        db.comments.splice(index, 1);
        res.redirect("/results/" + round);
    }
    else {
        res.status(404);
        res.end('Not found');
    }
});
if (externalUrl) {
    var hostname_1 = '127.0.0.1';
    app.listen(port, hostname_1, function () {
        console.log("Server locally running at http://".concat(hostname_1, ":").concat(port, "/ and from\n        outside on ").concat(externalUrl));
    });
}
else {
    https_1["default"].createServer({
        key: fs_1["default"].readFileSync('server.key'),
        cert: fs_1["default"].readFileSync('server.cert')
    }, app)
        .listen(port, function () {
        console.log("Server running at https://localhost:".concat(port, "/"));
    });
}
