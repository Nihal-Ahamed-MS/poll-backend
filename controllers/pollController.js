// routes/pollRoutes.js
import express from 'express';
import Poll from '../models/Poll.js';
import User from '../models/User.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
    try {
        const { name, description, choices } = req.body;
        const userId = req.user._id;

        const newPoll = new Poll({
            name,
            description,
            choices: choices,
            createdBy: userId,
        });

        const savedPoll = await newPoll.save();
        console.log(savedPoll, "savedPoll");
        
        await User.findByIdAndUpdate(userId, { $push: { pollList: savedPoll._id } });

        res.status(201).json(savedPoll);
    } catch (error) {
        console.error("Error in POST /api/polls route:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const polls = await Poll.find()
            .populate('createdBy', 'username email')
            .populate('choices.votes', 'username');
        res.json(polls);
    } catch (error) {
        console.error("Error in GET /api/polls route:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post("/:pollId/vote", authenticate, async (req, res) => {
    try {
        const { pollId } = req.params;
        const { choiceId } = req.body;
        const userId = req.user._id;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        const choiceToVoteFor = poll.choices.id(choiceId);
        if (!choiceToVoteFor) {
            return res.status(404).json({ message: 'Choice not found' });
        }

        if (poll.choices.some(choice => choice.votes.includes(userId))) {
            return res.status(400).json({ message: 'User has already voted for this poll' });
        }

        choiceToVoteFor.votes.push(userId);
        const updatedPoll = await poll.save();

        res.json(updatedPoll);
    } catch (error) {
        console.error("Error in POST /api/polls/:pollId/vote route:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/:pollId/result", async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.pollId)
            .populate('createdBy', 'username email')
            .populate('choices.votes', 'username');

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        const totalVotes = poll.choices.reduce((acc, curr) => (acc + curr.votes.length), 0)
        console.log(poll.choices, totalVotes, "totalVotes");
        
        const results = poll.choices.map(choice => ({
            _id: choice._id,
            choiceName: choice.choiceName,
            voteInPercentage: Math.round((choice.votes.length/totalVotes) * 100),
            voteCount: choice.votes.length,
        }));

        res.json({
            _id: poll._id,
            name: poll.name,
            totalVotes,
            description: poll.description,
            createdBy: poll.createdBy,
            choices: results,
        });
    } catch (error) {
        console.error("Error in GET /api/polls/:pollId/results route:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;