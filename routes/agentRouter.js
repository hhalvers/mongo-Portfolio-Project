const express = require('express');
const Agent = require('../models/agent');

const agentRouter = express.Router();

agentRouter.route('/')
.get((req, res, next) => {
    Agent.find()
    .then(agents => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(agents);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Agent.create(req.body)
    .then(agent => {
        console.log('Agent Created ', agent);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(agent);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /agents');
})
.delete((req, res, next) => {
    Agent.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

agentRouter.route('/:agentId')
.get((req, res, next) => {
    Agent.findById(req.params.agentId)
    .then(agent => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(agent);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /agents/${req.params.agentId}`);
})
.put((req, res, next) => {
    Agent.findByIdAndUpdate(req.params.agentId, {
        $set: req.body
    }, { new: true })
    .then(agent => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(agent);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Agent.findByIdAndDelete(req.params.agentId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

agentRouter.route('/:agentId/comments')
.get((req, res, next) => {
    Agent.findById(req.params.agentId)
    .then(agent => {
        if (agent) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(agent.comments);
        } else {
            err = new Error(`Agent ${req.params.agentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Agent.findById(req.params.agentId)
    .then(agent => {
        if (agent) {
            agent.comments.push(req.body);
            agent.save()
            .then(agent => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(agent);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Agent ${req.params.agentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /agents/${req.params.agentId}/comments`);
})
.delete((req, res, next) => {
    Agent.findById(req.params.agentId)
    .then(agent => {
        if (agent) {
            for (let i = (agent.comments.length-1); i >= 0; i--) {
                agent.comments.id(agent.comments[i]._id).remove();
            }
            agent.save()
            .then(agent => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(agent);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Agent ${req.params.agentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});



module.exports = agentRouter;

