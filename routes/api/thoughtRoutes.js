const router = require('express').Router();
const { Thought, User } = require('../../models');

// GET all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find().populate('reactions');
    res.json(thoughts);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// GET a single thought by _id
router.get('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findOne({ _id: req.params.thoughtId }).populate('reactions');
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// POST to create a new thought
router.post('/', async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    const user = await User.findOneAndUpdate({ _id: req.body.userId }, { $push: { thoughts: thought._id } }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// PUT to update a thought by _id
router.put('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, { new: true });
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// DELETE to remove a thought by _id
router.delete('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    const user = await User.findOneAndUpdate({ username: thought.username }, { $pull: { thoughts: thought._id } }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Thought deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// POST to create a reaction stored in a single thought's reactions array field
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $push: { reactions: req.body } }, { new: true });
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// DELETE to pull and remove a reaction by the reaction's reactionId value
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { _id: req.params.reactionId } } },
      { new: true }
    );
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
