const User = require("../models/User");
const Expense = require("../models/Expense");

const showLeaderboard = async (req, res) => {

    try {

        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!user.isPremium) {

            return res.status(403).json({
                message:
                    "Only premium users can access the leaderboard"
            });
        }


        const users = await User.findAll({
            attributes: [
                "id",
                "name"
            ],

            include: [
                {
                    model: Expense,

                    attributes: [
                        "id",
                        "amount",
                        "description",
                        "category",
                        "createdAt"
                    ]
                }
            ]
        });

        console.log(users);
        const leaderboard = users.map(user => {

            const expenses = user.Expenses || [];

            const totalExpense = expenses.reduce(
                (total, expense) => {
                    return total + Number(expense.amount);
                },
                0
            );

            return {
                id: user.id,
                name: user.name,
                totalExpense,
                expenses
            };

        });


        leaderboard.sort(
            (a, b) =>
                b.totalExpense - a.totalExpense
        );


        res.status(200).json({
            leaderboard
        });


    } catch (error) {

        console.log(
            "Leaderboard error:",
            error
        );

        res.status(500).json({
            message: "Unable to load leaderboard"
        });
    }
};


module.exports = {
    showLeaderboard
};