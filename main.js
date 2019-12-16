(() => {
    $(() => {
        var currenciesArray = [];


        // display Currencies when loading the page
        displayCurrencies();

        // display Currencies when clicking on Coins Button

        $("#coinsButton").click(function () {
            currenciesArray = [];
            displayCurrencies();
        });

        // Search for a specific coin in all 5000 Coins

        $("#searchButton").click(() => {
            let id = $("#searchBox").val();

            displaySearchCurrencies(id);
        })

        // Search function to find a specific currency

        function displaySearchCurrencies(id) {
            $("#loading").css("display", "block");
            $.getJSON((`https://api.coingecko.com/api/v3/coins/${id}`), coins => {
                $(".container").empty();
                if (id === coins.id) {
                    const symbol = `<h5 class="card-text">${coins.symbol}</h5>`;
                    const name = `<p class="card-title">${coins.name}</p>`;
                    const button = `<p><button id="${coins.id}" class="btn btn-primary" data-toggle="collapse"
                                role="button" aria-expanded="false" aria-controls="collapseExample">
                                      More Info</button></p>`;
                    const toggleButton = `<label class="switch">
                                      <input type="checkbox" class="checkBoxClass" value="${coins.symbol}">
                                      <span class="slider round"></span>
                                      </label>`;
                    const moreInfo = `<div class="${coins.id}"></div>`;
                    const allDetails = `<div id =${coins.id} class="card card-block col-12 col-md-4">
                                ${symbol}${name}${toggleButton}${button}${moreInfo}</div>`;
                    $(".container").append(allDetails);
                    $("#loading").css("display", "none");

                }

            }).fail(() => {
                alert(`No data found, please enter the name of the coin and not the symbol`);
            });
        }


        // function display currencies

        function displayCurrencies() {
            $("#loading").css("display", "block");
            $.getJSON((`https://api.coingecko.com/api/v3/coins/list`), coins => {
                $(".container").empty();
                for (let i = 0; i < 100; i++) {

                    const symbol = `<h5 class="card-text">${coins[i].symbol}</h5>`;
                    const name = `<p class="card-title">${coins[i].name}</p>`;
                    const button = `<p><button id="${coins[i].id}" class="btn btn-primary" data-toggle="collapse"
                                        role="button" aria-expanded="false" aria-controls="collapseExample">
                                              More Info</button></p>`;
                    const toggleButton = `<label class="switch">
                                              <input type="checkbox" id="${coins[i].symbol}Toggle" class="checkBoxClass" value="${coins[i].symbol}">
                                              <span class="slider round"></span>
                                              </label>`;
                    const moreInfo = `<div class="${coins[i].id}"></div>`;
                    const allDetails = `<div id =${coins[i].id} class="card card-block col-12 col-md-4">
                                        ${symbol}${name}${toggleButton}${button}${moreInfo}</div>`;
                    $(".container").append(allDetails);
                    $("#loading").css("display", "none");

                }

            }).fail(() => {
                alert(`No data found`);
            });
        }

        // function Loading when waiting to get the Data

        function loading(id) {
            const loading = `<div class="loader"></div>`;
            $(`.${id}`).append(loading);
        }

        // function display More info data of each coin

        function displayCollapse(id) {

            // check if exist in local storage
            var str = localStorage.getItem(id);
            console.log("str from local storage: " + str)

            // if no -> get from url, and save result to local storage
            if (str === null) {
                $.getJSON("https://api.coingecko.com/api/v3/coins/" + id, json => {

                    console.log("got json from url")
                    var miniJson = {};
                    miniJson.image = {};
                    miniJson.image.small = json.image.small;
                    miniJson.symbol = json.symbol;
                    miniJson.market_data = {};
                    miniJson.market_data.current_price = {};
                    miniJson.market_data.current_price.usd = json.market_data.current_price.usd;
                    miniJson.market_data.current_price.eur = json.market_data.current_price.eur;
                    miniJson.market_data.current_price.ils = json.market_data.current_price.ils;

                    var strJson = JSON.stringify(miniJson);
                    localStorage.setItem(id, strJson);
                    console.log("save minijson in storage")
                    updateCoinInfo(id, strJson)
                    setTimeout(() => {
                        localStorage.removeItem(id);
                    }, 120000);
                }).fail(() => {
                    alert(`No data found`);
                });
            }

            // if yes -> get data from storage and put in html
            else {
                console.log("displaying from local storage")
                updateCoinInfo(id, str);
            }
        }


        function updateCoinInfo(id, infoDetails) {

            var json = JSON.parse(infoDetails)

            const img = `<img src="${json.image.small}">`;
            const eur = `<p>${json.symbol}/ USD: ${json.market_data.current_price.usd}ֿ$</p>`;
            const usd = `<p>${json.symbol}/ EUR: ${json.market_data.current_price.eur}€</p>`;
            const ils = `<p>${json.symbol}/ ILS: ${json.market_data.current_price.ils}₪</p>`;
            const moreInfoDetails = `<div>${img}${eur}${usd}${ils}</div>`;

            $(`.${id}`).html(moreInfoDetails)
        }

        // Display more info data of the coin when clicked

        $(".container").on("click", ".btn-primary", function () {

            loading(`${this.id}`);
            displayCollapse(`${this.id}`);
            $(`.${this.id}`).collapse("toggle");

        });

        // Choose 5 currencies with toggle
        $(".container").on("click", ".checkBoxClass", function () {

            if ($(this).is(":checked")) {
                currenciesArray.push($(this).val().toUpperCase());
                let currenciesStr = JSON.stringify(currenciesArray);
                localStorage.setItem("coins", currenciesStr)
            }

            else {
                let localIndex = currenciesArray.indexOf($(this).val().toUpperCase());
                currenciesArray.splice(localIndex, 1);
                localStorage.setItem("coins", JSON.stringify(currenciesArray))
            }

            if (currenciesArray.length > 5) {
                currenciesArray.splice(5, 1);
                $(`#myModal`).modal();
                $(".modal-body").empty(),
                    modalContent();

            }
        })

        //Remove coin with modal

        function removeCoin(value) {
            let item = localStorage.getItem("coins");
            let parseCoin = JSON.parse(item);

            for (let i = 0; i < parseCoin.length; i++) {
                if (parseCoin[i] === value) {


                    parseCoin.splice(i, 1)
                    localStorage.removeItem("coins");
                    localStorage.setItem("coins", parseCoin);
                }
            }
        }


        // Create Modal Content
        function modalContent() {
            $.each(currenciesArray, function (index, value) {
                let valueLow = value.toLowerCase();
                const coinName = `<div><p>${valueLow}</p>`;
                const button = `<button id="${valueLow}replace">Delete ${valueLow}</button></div>`;
                const allContent = `<div id="${valueLow}">${coinName}${button}</div>`;
                $(".modal-body").append(allContent);
                $(`#${valueLow}replace`).click(() => {
                    removeCoin(value);
                    $(`#${valueLow}replace`).css("color", "blue");
                    $(`#${valueLow}replace`).html(`${valueLow} has been deleted `);

                    $(`#${valueLow}Toggle`).prop("checked", false);
                })

            });

        }


        // Create the graph when clicking

        $("#reportsButton").click(() => {
            if (currenciesArray.length < 1) {
                let msg = alert("Please select at least one coin");
                $(".container").append(msg);
                return;

            }

            let dataPoints = [[], [], [], [], []];
            let dataReports = [];


            // Create the chart container
            const chartContainer = `<div id="chartContainer" style="height: 500px; width: 100%;"></div>`
            $(".container").html(chartContainer);

            let options = {

                exportEnabled: true,
                animationEnabled: true,
                type: "spline",

                title: {
                    text: "Market Chart"
                },
                subtitles: [{
                    text: "Digital Coins"
                }],
                axisY: {
                    title: "USD",
                    titleFontColor: "#4F81BC",
                    lineColor: "#4F81BC",
                    labelFontColor: "#4F81BC",
                    tickColor: "#4F81BC",
                    includeZero: false
                },


                // Add or remove coins from the graph

                legend: {
                    cursor: "pointer",
                    itemclick: toggleDataSeries
                },

                data: dataReports
            };

            // graph without data

            for (let i = 0; i < currenciesArray.length; i++) {
                dataReports.push({ type: "spline", name: `${currenciesArray[i]}`, showInLegend: true, dataPoints: dataPoints[i] });
            }


            // Get API for chosen coins

            function getData() {
                $.getJSON("https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + currenciesArray + "&tsyms=USD", json => {

                    for (let i = 0; i < currenciesArray.length; i++) {
                        if (json[currenciesArray[i]] === undefined) {
                            continue;
                        }

                        let yValue = json[currenciesArray[i]]["USD"];
                        dataPoints[i].push({ x: new Date(), y: yValue });

                    }

                    $("#chartContainer").CanvasJSChart().render();

                })
            }

            $("#chartContainer").CanvasJSChart(options);


            setInterval(getData, 2000);

        });



        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        }

        // About Button

        $("#aboutButton").click(() => {
            $(".container").empty();
            const name = `<h5 id:"name">Name: Daphne Levy</h5>`;
            const projectInfo = `<p id="info">The aim of this website is to provide live data about cryptocurrencies and to practice the following:</p>`
            const studentKnowledge = `<ul id="infoProject"><li>HTML + CSS</li><li>Javascript</li><li>External APi's</li><li>jQuery</li></ul>`;
            const image = `<img id="image" src="assets/images/daph.jpg">`
            let allDetails = `<div id="allDetails">${name}${projectInfo}${studentKnowledge}${image}</div>`;
            $(".container").html(allDetails);

        });

    });
})();