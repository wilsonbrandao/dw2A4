const Modal = {
    open() {
        //Abrir modal
        //Adcionar a class active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    }, close() {
        //fechar o modal
        //remover classe active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
};

const Storage = {
    get() {
        return JSON
            .parse(localStorage.getItem("devtransactions.finances:")) || []
    },

    set(transactions) {
        localStorage
            .setItem("devtransactions.finances:", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)
        App.reload();
    },

    remove(index) {
        Transaction.all.splice(index, 1);
        App.reload();
    },

    incomes() {
        let income = 0;

        income = Transaction.all.reduce((acumulador, transaction) => {
            return transaction.amount > 0 ? acumulador + transaction.amount : acumulador;
        }, 0);

        return income;
    },

    expenses() {
        let expense = 0;

        expense = Transaction.all.reduce((acumulador, transaction) => {
            return transaction.amount < 0 ? acumulador + transaction.amount : acumulador;
        }, 0);

        return expense;
    },

    total() {
        let total = 0;

        total = Transaction.incomes() + Transaction.expenses();

        return total;
    }
};

const DOM = {
    transactionsContainer: document.querySelector("#data-table tbody"),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;

        DOM.transactionsContainer.appendChild(tr);


    },

    innerHTMLTransaction(transaction, index) {
        const CSSclasses = transaction.amount > 0 ? 'income' : 'expense';

        const amount = Utils.formatCurrency(transaction.amount);

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclasses}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="assets/minus.svg" alt="Remover transação">
            </td>
        `
        return html;
    },

    updateBalance() {
        document
            .querySelector('#incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes());

        document
            .querySelector('#expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses());

        document
            .querySelector('#totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total());
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = "";
    }
};

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100;
        return value;
    },

    formatDate(date) {
        const splittedDate = date.split("-");
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";

        value = String(value).replace(/\D/g, "");

        value = Number(value) / 100;

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        return signal + value;
    }
};

const Form = {
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateField() {
        const { description, amount, date } = Form.getValues();
        if (description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "")
            throw new Error("Por favor preencha todos os campos")
    },

    formatValues() {
        let { description, amount, date } = Form.getValues();
        amount = Utils.formatAmount(amount);
        date = Utils.formatDate(date);

        return {
            description,
            amount,
            date
        }
    },

    saveTransaction(transaction) {
        Transaction.add(transaction)
    },

    clearFileds() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault();

        try {
            Form.validateField();
            const transaction = Form.formatValues();

            Form.saveTransaction(transaction);
            Form.clearFileds();
            Modal.close();
        } catch (error) {
            alert(error.message)
        }

    }
};

const App = {
    init() {

        Transaction.all.forEach((transaction, index) => DOM.addTransaction(transaction, index))

        DOM.updateBalance();

        Storage.set(Transaction.all)

    },
    reload() {
        DOM.clearTransactions();
        App.init();
    },

};

App.init();