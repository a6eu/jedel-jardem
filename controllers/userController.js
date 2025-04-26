const User = require('../models/User')

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password')
        res.json(users)
    } catch (error) {
        res.status(500).json({message: 'Server error'})
    }
}

exports.getMe = async (req, res) => {
    console.log('req.user:', req.user);
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await User.findById(req.user.id).select('-password')
        if (!user) {
            return res.status(404).json({message: 'User not found'})
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({message: 'Server error'})
    }
}

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password')
        if (!user) return res.status(404).json({message: 'User not found'})
        res.json(user)
    } catch (error) {
        res.status(500).json({message: 'Server error'})
    }
}

exports.updateUser = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    const {
        name,
        role,
        specialisation,
        birthYear,
        gender,
        company,
        phone,
        bio,
        patientData
    } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name,
                role,
                specialisation,
                birthYear,
                gender,
                company,
                phone,
                bio,
                patientData
            },
            {new: true, runValidators: true}
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({message: 'User not found'});
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({message: 'User not found'});
        }
        await User.findByIdAndDelete(req.params.id)
        res.json({message: 'User deleted'})
    } catch (error) {
        res.status(500).json({message: 'Server error'})
    }
}

exports.reviewUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({message: 'User not found'});
        }

        const {doctorId, review} = req.body;

        if (!doctorId || !review) {
            return res.status(400).json({message: 'Doctor ID and review are required'});
        }

        const updatedDoctor = await User.findByIdAndUpdate(
            doctorId,
            {$push: {reviews: review}},
            {new: true}
        ).select('-password');

        if (!updatedDoctor) {
            return res.status(404).json({message: 'Doctor not found'});
        }

        res.json(updatedDoctor);
    } catch (e) {
        res.status(500).json({message: 'Server error'}, e.message);
    }
}
