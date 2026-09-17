const Expense = require("../models/Expense");
const User = require("../models/User");


// ADD EXPENSE
const addExpense = async (req, res) => {

    try {

        const {
            amount,
            description,
            category
        } = req.body;


        if (!amount || !description || !category) {

            return res.status(400).json({
                message:
                    "Amount, description and category are required"
            });

        }


        const expense = await Expense.create({

            amount,

            description,

            category,

            userId: req.user.id

        });

        await User.increment(
            { totalexpenses: amount },
            { where: { id: req.user.id } }
        );
        


        res.status(201).json({

            message: "Expense added successfully",

            expense

        });


    } catch (error) {

        console.error(
            "Add expense error:",
            error
        );

        res.status(500).json({

            message:
                "Internal server error"

        });

    }
};



// GET ALL EXPENSES
const getExpenses = async (req, res) => {

    try {

        const expenses =
            await Expense.findAll({

                where: {
                    userId: req.user.id
                },

                order: [
                    ["createdAt", "DESC"]
                ]

            });


        res.status(200).json({

            expenses

        });


    } catch (error) {

        console.error(
            "Get expenses error:",
            error
        );

        res.status(500).json({

            message:
                "Internal server error"

        });

    }
};



// DELETE EXPENSE
const deleteExpense = async (req, res) => {

    try {

        const { id } = req.params;


        const expense =
            await Expense.findOne({

                where: {
                    id,
                    userId: req.user.id
                }

            });


        if (!expense) {

            return res.status(404).json({

                message:
                    "Expense not found"

            });

        }


        await expense.destroy();


        res.status(200).json({

            message:
                "Expense deleted successfully"

        });


    } catch (error) {

        console.error(
            "Delete expense error:",
            error
        );

        res.status(500).json({

            message:
                "Internal server error"

        });

    }
};


module.exports = {
    addExpense,
    getExpenses,
    deleteExpense
};