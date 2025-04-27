export const registerUser = async (req, res) => {
    try {
        const { name, email, password, gender } = req.body;
        const file = req.file; // assuming you're using multer or similar for file uploads

        if (!name || !email || !password || !gender || !file) {
            return res.status(400).json({
                message: "give all value , now !!!"
            });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "user Already exist"
            });
        }

        // Add logic to create and save the user here

        res.status(201).json({
            message: "User registered successfully"
            // Optionally return created user data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
