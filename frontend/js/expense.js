const API_URL =
    "http://localhost:3000";


const token =
    localStorage.getItem("token");

const user =
    JSON.parse(
        localStorage.getItem("user")
    );


// Don't allow access without login

if (!token || !user) {

    window.location.href =
        "./js/login.html";

}


// Display user name

document.getElementById(
    "welcomeUser"
).textContent =
    `Welcome, ${user.name}`;


const expenseForm =
    document.getElementById(
        "expenseForm"
    );


const addExpenseButton =
    document.getElementById(
        "addExpenseButton"
    );


const expensesContainer =
    document.getElementById(
        "expensesContainer"
    );


const expenseMessage =
    document.getElementById(
        "expenseMessage"
    );


// =====================================
// FETCH EXPENSES
// =====================================

const fetchExpenses = async () => {

    try {

        const response =
            await fetch(
                `${API_URL}/expense`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message
            );

        }


        displayExpenses(
            data.expenses
        );


    } catch (error) {

        expensesContainer.innerHTML = `

            <div class="alert alert-danger">
                ${error.message}
            </div>

        `;

    }

};



// =====================================
// DISPLAY EXPENSES
// =====================================

const displayExpenses =
    (expenses) => {


    if (expenses.length === 0) {

        expensesContainer.innerHTML = `

            <div class="text-center text-muted py-4">

                No expenses added yet.

            </div>

        `;

        return;

    }


    expensesContainer.innerHTML =
        expenses.map(
            (expense) => `

            <div
                class="border rounded p-3 mb-3"
            >

                <div
                    class="d-flex justify-content-between align-items-start"
                >

                    <div>

                        <h5 class="mb-1">
                            ₹${expense.amount}
                        </h5>

                        <p class="mb-1">
                            ${expense.description}
                        </p>

                        <span
                            class="badge bg-secondary"
                        >
                            ${expense.category}
                        </span>

                    </div>


                    <button
                        class="btn btn-sm btn-danger"
                        onclick="deleteExpense(${expense.id})"
                    >
                        Delete
                    </button>

                </div>

            </div>

        `
        ).join("");

};



// =====================================
// ADD EXPENSE
// =====================================

expenseForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const amount =
            document.getElementById(
                "amount"
            ).value;


        const description =
            document.getElementById(
                "description"
            ).value.trim();


        const category =
            document.getElementById(
                "category"
            ).value;


        // Object sent to backend

        const expenseData = {

            amount,

            description,

            category

        };


        console.log(
            "Expense:",
            expenseData
        );


        addExpenseButton.disabled =
            true;


        addExpenseButton.textContent =
            "Adding...";


        try {

            const response =
                await fetch(
                    `${API_URL}/expense/add`,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify(
                                expenseData
                            )
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message
                );

            }


            expenseMessage.className =
                "alert alert-success mt-3";


            expenseMessage.textContent =
                data.message;


            expenseForm.reset();


            // Fetch updated expenses

            await fetchExpenses();


        } catch (error) {

            expenseMessage.className =
                "alert alert-danger mt-3";


            expenseMessage.textContent =
                error.message;

        } finally {

            addExpenseButton.disabled =
                false;


            addExpenseButton.textContent =
                "Add Expense";

        }

    }
);



// =====================================
// DELETE EXPENSE
// =====================================

const deleteExpense =
    async (id) => {

    try {

        const response =
            await fetch(
                `${API_URL}/expense/${id}`,
                {
                    method: "DELETE",

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message
            );

        }


        // Refresh list

        await fetchExpenses();


    } catch (error) {

        alert(error.message);

    }

};



// =====================================
// LOGOUT
// =====================================

document.getElementById(
    "logoutButton"
).addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );


        window.location.href =
            "./login.html";

    }
);



// Load old expenses when page opens

fetchExpenses();