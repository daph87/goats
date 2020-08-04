(() => {
    $(() => {
        var currenciesArray = [];
        let onChecked = [];
        let checked = [];
        let found = [];


        // display Currencies when loading the page
        displayCurrencies();

        // display Currencies when clicking on Coins Button

        $("#coinsButton").click(function () {
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
            $.getJSON((`https://api.coingecko.com/api/v3/coins/${id}`), coin => {
                $(".container").empty();
                if (id === coin.id) {
                    let coins = [];
                    coins.push(coin);
                    currencyContentBox(coins, 0);
                }

            }).fail(() => {
                alert(`No data found, please enter the name of the coin and not the symbol`);
            });
        }


        //function currencies content
        function currencyContentBox(coins, i) {

            const symbol = `<h5 class="card-text">${coins[i].symbol}</h5>`;
            const name = `<p class="card-title">${coins[i].name}</p>`;
            const button = `<p><button id="${coins[i].id}" class="btn btn-primary" data-toggle="collapse"
                                role="button" aria-expanded="false" aria-controls="collapseExample">
                                      More Info</button></p>`;
            const toggleButton = `<label class="switch">
                                      <input ${checked[i]} type="checkbox"  id="${coins[i].symbol}Toggle" class="checkBoxClass" value="${coins[i].symbol}">
                                      <span class="slider round ${checked[i]}"></span>
                                      </label>`;
            const moreInfo = `<div class="${coins[i].id}"></div>`;
            const allDetails = `<div id =${coins[i].id} class="card card-block col-12 col-md-4">
                                ${symbol}${name}${toggleButton}${button}${moreInfo}</div>`;
            $(".container").append(allDetails);
            $("#loading").css("display", "none");
        }

        // function display currencies

        function displayCurrencies() {
            $("#loading").css("display", "block");
            $.getJSON((`https://api.coingecko.com/api/v3/coins/list`), coins => {
                $(".container").empty();
                let localHostCurrencies;
                localHostCurrencies = JSON.parse(localStorage.getItem("coins"));

                if (localHostCurrencies === null) {
                    for (let i = 0; i < 100; i++) {
                        currencyContentBox(coins, i);
                    }
                }
                else {

                    currenciesArray = localHostCurrencies;

                    for (let i = 0; i < 100; i++) {
                        onChecked = [];
                        for (let j = 0; j < localHostCurrencies.length; j++) {
                            if (localHostCurrencies[j] === coins[i].symbol.toUpperCase()) {
                                onChecked.push("checked");

                            }
                            else if (localHostCurrencies[j] !== coins[i].symbol.toUpperCase()) {
                                onChecked.push("");
                            }
                            found = onChecked.find(element => element === "checked");

                        }
                        checked.push(found);
                        currencyContentBox(coins, i);
                    }
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

            // if no -> get from url, and save result to local storage
            if (str === null) {
                $.getJSON("https://api.coingecko.com/api/v3/coins/" + id, json => {
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
                    updateCoinInfo(id, strJson)
                    setTimeout(() => {
                        localStorage.removeItem(id);
                    }, 12000);
                }).fail(() => {
                    alert(`No data found`);
                });
            }

            // if yes -> get data from storage and put in html
            else {
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
        $(".container").on("change", ".checkBoxClass", function () {
           
            if ($(this).is(":checked") && currenciesArray.length >=5) {
                $(this).prop('checked', false);
                $(`#myModal`).modal();
                $(".modal-body").empty(),
                    modalContent();
            }

            else if ($(this).is(":checked")) {
                currenciesArray.push($(this).val().toUpperCase());
                let currenciesStr = JSON.stringify(currenciesArray);
                localStorage.setItem("coins", currenciesStr);
                
            }

            else if ($(this).prop('checked', false)) {
                let coinValue = $(this)[0].value.toUpperCase();
                let index = currenciesArray.indexOf(coinValue);
                currenciesArray.splice(index, 1);
                let currenciesStr = JSON.stringify(currenciesArray);
                localStorage.setItem("coins", currenciesStr);
            }
        })

        //Remove coin with modal

        function removeCoin(value) {
            let local = localStorage.getItem("coins");
            let parseCoin = JSON.parse(local);
            if (parseCoin === null) {
                parseCoin = currenciesArray;
            }
            let item = currenciesArray;

            for (let i = 0; i < currenciesArray.length; i++) {
                if (item[i] === value) {
                    currenciesArray.splice(i, 1);
                    let parseCoinStr = JSON.stringify(currenciesArray);
                    localStorage.setItem("coins", parseCoinStr);
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
