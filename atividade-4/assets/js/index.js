const DOM = {
    totalCases: document.getElementById("casesDisplay"),
    totalSuspects: document.getElementById("suspectsDisplay"),
    totalDeaths: document.getElementById("deathsDisplay"),
    HeaderText: document.getElementById("stateDisplay"),


    addCovidData(data) {
        const header = `CONONAVÍRUS - ${data.state}`
        DOM.HeaderText.innerHTML = header.toLocaleUpperCase();
        DOM.totalCases.innerHTML = data.cases.toLocaleString()
        DOM.totalSuspects.innerHTML = data.suspects.toLocaleString()
        DOM.totalDeaths.innerHTML = data.deaths.toLocaleString()
    },

    initialCovidData(data) {
        const header = `CONONAVÍRUS - ${data.country}`
        DOM.HeaderText.innerHTML = header.toLocaleUpperCase();
        DOM.totalCases.innerHTML = data.confirmed.toLocaleString()
        DOM.totalSuspects.innerHTML = "Sem Informação"
        DOM.totalDeaths.innerHTML = data.deaths.toLocaleString()
    }
    
}

const cep = {
    cepNumber: "",
    async getCEP(cepNumber) {
        const response = await fetch(`https://viacep.com.br/ws/${cepNumber}/json/`)
        const data = await response.json();
        return data;
    }

}

const CovidApi = {
    async getDatasBrazil() {
        const response = await fetch("https://covid19-brazil-api.now.sh/api/report/v1/brazil")
        const data = await response.json();
        return data.data;
    },
    async getDatas(uf) {
        const response = await fetch(`https://covid19-brazil-api.now.sh/api/report/v1/brazil/uf/${uf}`)
        const data = await response.json();
        return data;
    }

}

const Form = {
    inputTag:  document.getElementById('cep-search'),
    submit(event){
        event.preventDefault();
        const cepValue = Form.inputTag.value;
        cep.cepNumber = Mask.formatSubmit(cepValue);
        cep.getCEP(cep.cepNumber)
            .then(response => {
                const city = response.uf
                CovidApi.getDatas(city).then(response => {
                    DOM.addCovidData(response);
                })
            })
    }
}

const Mask = {
    cep(value){
        return value
        .replace(/\D/g,'') 
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1')
    }, 
    applyMask(input){
      input.addEventListener('input', e => {
        e.target.value = Mask.cep(e.target.value)
    }, false)
    },
    formatSubmit(value){
        return value.replace(/\D/g,'')
    }
}

const App = {
    init(){
        Mask.applyMask(Form.inputTag);
        CovidApi.getDatasBrazil().then(response => DOM.initialCovidData(response))

    }
}

App.init();








