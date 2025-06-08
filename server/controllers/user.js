import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { inngest } from '../inngest/client.js';

export const signup = async (req, res) => {
    const { email, password, skills = [] } = req.body;
    try {
        const hashed = bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashed, skills });

        await inngest.send({
            name: 'user/signup',
            data: {
                email
            }
        });

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);

        res.json({ user, token });
    } catch (error) {
        res.status(500).json({ error: '❌ Signup Failed!', details: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: '❌ User not found!' });
        } else {
            const isMatch = bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: '❌ Invalid password' });
            }
            const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
            res.json({ user, token });
        }
    } catch (error) {
        res.status(500).json({ error: '❌ Login Failed!', details: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: '⚠️ Not authenticated!' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                return res.status(401).json({ error: '⚠️ Invalid token' });
            }
            return res.json({ message: '✅ Successfully logged out' });
        })
    } catch (error) {
        res.status(500).json({ error: '❌ Logout Failed!', details: error.message });
    }
}

export const updateUser = async (req, res) => {
    const { skills = [], role, email } = req.body;
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: '❌ Unauthorized to update user' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: '❌ User not found' });
        }

        await User.updateOne(
            { email },
            { skills: skills.length ? skills : user.skills, role }
        )
        return res.json({ message: '✅ User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: '❌ Update Failed!', details: error.message });
    }
}

export const getUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: '❌ Unauthorized to get user' });
        }

        const users = await User.find().select('-password');
        return res.json(users);
    } catch (error) {
        res.status(500).json({ error: '❌ Couldn\'t get users!', details: error.message });
    }
}