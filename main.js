
(() => {
    $(() => {

        let goats = [];
        let users = [];
        let oneGoat = {};
        let oneUser = "";
        let newUser = ""
        // let onePassword = "";
        // display Currencies when loading the page
        // displayCurrencies();
        // displayGoats();

        UserExists();
        // displayGoats();

       

        



        async function getGoats() {
            await fetch("http://localhost:5000/goats")
                .then(function (resp) {
                    return resp.json();
                })
                .then(function (data) {
                    goats = data;
                    goats.sort(function(a, b){
                        return new Date(a.birthDate) - new Date(b.birthDate)
                    });
                    console.log(goats, "goats")
                })
        }

        function displayGoats() {
            goats.sort(function(a, b){
                return new Date(a.birthDate) - new Date(b.birthDate)
            });

            console.log(goats,"after sort");
            for (let i = 0; i < goats.length; i++) {
                // if (oneUser.admin === "no") {
                //     $(".edit-button").css("display", "none");
                //     $(".delete-btn").css("display", "none");
                // }
                goatsContentBox(goats, i);

                //  console.log(displayVaccine(i))
            }
        }

        // Close Button

        $(".container-change").on("click", ".close-button", function () {
            $(".container-change").empty();
        })


        // Logout

        $("#logOutButton").click(function () {
            localStorage.clear();
            $(".container").empty();
            $(".container-change").empty();
            $("#addButton").css("display", "none");
            $("#logOutButton").css("display", "none");
            $("#registerButton").css("display", "none");
            displayLogin();
            $("#search").empty();

        })


        // See register form
        $("#registerButton").click(function () {
            $(".container").empty();
            let newUsername = `<input type="text" id="newUsername" value="" placeholder="Username"></br>`;
            let newPassword = `<input type="text" id="newPassword" value="" placeholder="Password"></br>`;
            let admin = `<select id="newAdmin" class="form-control">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>`;
            let button = `<button id="register">Register</button>`
            let registerForm = `${newUsername}${newPassword}${admin}${button}`;
            $(".container").append(registerForm);
        })

        // Register

        $(".container").on("click", "#register", async function () {
            newUser = {};
            let username = document.getElementById("newUsername").value;
            let password = document.getElementById("newPassword").value;
            let admin = document.getElementById("newAdmin").value;
            newUser = {
                username,
                password,
                admin
            }

            const jsonResp = await fetch("http://localhost:5000/users", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });
            console.log(jsonResp);
            alert("A new user has been registered");
            $(".container").empty();
            displayGoats();
        });




        //  Get user data
        async function getUsers() {
            await fetch("http://localhost:5000/users")
                .then(function (resp) {
                    return resp.json();
                })
                .then(function (data) {
                    users = data;
                    console.log(users);

                })

            // displayLogin();

        }

        function displayLogin() {

            let username = `<input type="text" id="username" value="" placeholder="Username"></br>`;
            let password = `<input type="password" id="password" value="" placeholder="Password"></br>`;
            let button = `<button id="login">Log in </button>`
            let loginForm = `${username}${password}${button}`;
            $(".container").append(loginForm);
        }


        //login into database website

        async function UserExists() {
            await getUsers();
            await getGoats();
            var str = localStorage.getItem("userDetails");
            oneUser = JSON.parse(str);

            if (oneUser) {
                console.log(oneUser, "localStorage");
                // $(".container").empty();
                $("#addButton").css("display", "block");
                $("#logOutButton").css("display", "block");
                if (oneUser.admin === "yes") {
                    $("#registerButton").css("display", "block");
                    $("#search").css("display", "flex");
                    // $("#search").css("display", "flex")
                }
                displayGoats();

                viewSearchBar();

            }
            else {
                $("#addButton").css("display", "none");
                $("#logOutButton").css("display", "none");
                displayLogin();

            }

        }

        function viewSearchBar(){
            let searchSex = `<select class="form-control" id="sexSearch">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select><button id="sexSearchButton">Search</button>`;
            let searchAge= `<input type="date" id="searchAge" value="" placeholder="search Age"><button id="ageSearchButton">Search</button>`;
            let searchColor= `<select class="form-control" id="colorSearch">
            <option value="b">Blue</option>
            <option value="y">Yellow</option>
          </select><button id="colorSearchButton">Search</button>`;

            let searchGoat= `<input type="text" id="searchAge" value="" placeholder="search Goat"><button id="goatSearchButton">Search</button>`;
            let searchBar= `${searchSex}${searchAge}${searchColor}${searchGoat}`

            $("#search").append(searchBar);
        }


        $("#search").on("click", "#sexSearchButton", function(){
            $(".container").empty();
            let sexGoat = $("#sexSearch").val();
            let sexSearchFound = [];

            for(let i = 0; i < goats.length ; i++){
                if(goats[i].sex === sexGoat){
                    sexSearchFound.push(goats[i])
                }
            }
            sexSearchFound.sort(function(a, b){
                return new Date(a.birthDate) - new Date(b.birthDate)
            });

            for (let i = 0; i < sexSearchFound.length; i++) {

                goatsContentBox(sexSearchFound, i);
            }
            
            console.log(sexSearchFound, "all sex goats")
        })


        $("#search").on("click", "#colorSearchButton", function(){
            $(".container").empty();
            let colorGoat = $("#colorSearch").val();
            let colorGoatFound = [];

            goats.forEach(goat =>{
                if(goat.colorCode.includes(colorGoat) || goat.colorCode.includes(colorGoat.toUpperCase())){
                    colorGoatFound.push(goat)
                }
            })
            colorGoatFound.sort(function(a, b){
                return new Date(a.birthDate) - new Date(b.birthDate)
            });
            for (let i = 0; i < colorGoatFound.length; i++) {
                goatsContentBox(colorGoatFound, i);
            }
        })

        $(".container").on("click", "#login", function () {
            let username = $("#username").val();
            let password = $("#password").val();
            oneUser = "";
            for (let i = 0; i < users.length; i++) {

                if (username === users[i].username && password === users[i].password) {
                    oneUser = users[i];
                    localStorage.setItem("userDetails", JSON.stringify(oneUser));
                    // Clear local storage after 1 hours
                    setTimeout(() => {
                        localStorage.clear();
                        window.location.reload();
                    }, 1000 * 60 * 60);
                    $(".container").empty();
                    $("#addButton").css("display", "block");
                    $("#logOutButton").css("display", "block");
                    if (oneUser.admin === "yes") {
                        $("#registerButton").css("display", "block");
                    }
                    else{
                        $("#search").css("display", "none")
                    }
                    displayGoats();

                }
            }

            if (oneUser === "") {
                alert("Your credentials are not correct")
            }
            else{
                viewSearchBar();
            }
        });


        // Edit a goat 
        $(".container-change").on("click", ".edit-btn", function () {
            console.log(`${this.id} this id`)
            if (window.confirm("Do you really want to edit this beautiful goat?")) {
                for (let i = 0; i < goats.length; i++) {
                    if ((`${this.id}`) == (goats[i].id)) {
                        goats[i].colorCode = $(`#color${goats[i].id}`).val();
                        goats[i].sex = $(`#sex${goats[i].id}`).val();
                        goats[i].pregnantStatus = $(`#status${goats[i].id}`).val();
                        goats[i].sold = $(`#sold${goats[i].id}`).val();
                        goats[i].birthDate = $(`#birth${goats[i].id}`).val();
                        goats[i].medicalHistory = $(`#medical${goats[i].id}`).val();
                        goats[i].vaccins = $(`#vaccins${goats[i].id}`).val();

                        //   console.log($(`#medical${goats[i].id}`))
                        // for (let j = 0; j < goats[i].vaccins.length; j++) {
                        //     goats[i].vaccins[j].name = $(`#vaccineName${goats[i].vaccins[j].id}`).val();
                        //     goats[i].vaccins[j].vaccinationDate = $(`#vaccineDate${goats[i].vaccins[j].id}`).val();

                        // }

                        oneGoat = goats[i];

                    }

                }
                $(".container").empty();
                displayGoats();

                (async () => {
                    const jsonResp = await fetch(`http://localhost:5000/goats/${oneGoat.id}`, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(oneGoat)
                    });
                    console.log(jsonResp);
                })();

                console.log(JSON.stringify(oneGoat), "oneGoatJson");
                console.log(oneGoat, "oneGoat");
                $(".container-change").empty();
                alert("your changes have been made, please refresh the page");
                // window.location.reload();

            }

        });

        // See edit form
        $(".container").on("click", ".edit-button", function () {
            $(".container-change").empty();
            for (let i = 0; i < goats.length; i++) {
                if ((`${this.id}`) == (goats[i].id)) {
                    console.log(this.id, goats[i].id,"this id")

                    var closeButton = `<button class="btn btn-danger close-button">x</button>`
                    var inputColorCode = `<input type="text" id="color${goats[i].id}" value="${goats[i].colorCode}"></br>`;
                    var inputSex = `<select class="form-control" id="sex${goats[i].id}">
                    <option selected="true" disabled>${goats[i].sex}</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>`;
                    var inputPregnantStatus =
                        `<select class="form-control" id="status${goats[i].id}">
                    <option selected="true" disabled>${goats[i].pregnantStatus}</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>`;
                    var inputBirthDate = `<input type="date" id="birth${goats[i].id}" value="${goats[i].birthDate}" placeholder="name"></br>`;
                    var inputSold =
                        `<select class="form-control" id="sold${goats[i].id}">
                    <option selected="true" disabled>${goats[i].sold}</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>`;
                    var inputMedicalHistory = `<input type="text" id="medical${goats[i].id}" value="${goats[i].medicalHistory}" placeholder="name"></br>`;
                    var inputVaccins = `<input type="text" id="vaccins${goats[i].id}" value="${goats[i].vaccins}" placeholder="name"></br>`;
                    var editGoatButton = `<button class="edit-btn" id=${goats[i].id}>Edit</button>`
                    var allDetails = `${closeButton}${inputVaccins}${inputColorCode}${inputSex}${inputPregnantStatus}${inputBirthDate}${inputSold}${inputMedicalHistory}${editGoatButton}`;
                    $(".container-change").append(allDetails);
                }
            }


        });

        // Delete goat
        $(".container").on("click", ".delete-btn", function () {

            if (window.confirm("Do you really want to delete this beautiful goat?")) {

                (async () => {
                    let deletedGoat;
                    goats.forEach(goat => {
                        if(goat.id == this.id){
                            deletedGoat = goat
                        }
                    });

                    let index = goats.indexOf(deletedGoat);
                    goats.splice(index, 1);
                    $(".container").empty();
                    displayGoats();

                    const jsonResp = await fetch(`http://localhost:5000/goats/${this.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        // body: JSON.stringify(oneGoat)
                    });
                    console.log(jsonResp)
                    // window.location.reload();
                })();

                alert("this goat has been deleted");
            }

        })

        // Goat content card

        function goatsContentBox(goats, i) {
            const divCircle = `<div class="circle" id="circle${goats[i].id}"></div>`
            const editButton = `<button class="btn btn-dark edit-button" id="${goats[i].id}">Edit Goat</button>`;
            const colorCode = `<h5 class="card-text"> <span class="titleColor">Color code:</span> ${goats[i].colorCode}</h5>`;
            const birthDate = `<p class="card-title"><span class="boldColor">Birth Date:</span> ${goats[i].birthDate}</p>`;
            const pregnantStatus = `<p class="card-title"> <span class="boldColor">Pregnancy Status:</span> ${goats[i].pregnantStatus}</p>`;
            const sold = `<p class="card-title"><span class="boldColor">Sale:</span> ${goats[i].sold}</p>`;
            const vaccins = `<p class="card-title"><span class="boldColor">Vaccins:</span> ${goats[i].vaccins}</p>`;
            const medicalHistory = `<p class="card-title"><span class="boldColor">Medical History:</span> ${goats[i].medicalHistory}</p>`;
            const sex = `<p class="card-title"><span class="boldColor">Sex: </span>${goats[i].sex}</p>`;
            const deleteGoatButton = `<button class="delete-btn btn btn-danger" id="${goats[i].id}">x</button>`

            const id = `<p class="card-title">ID: ${goats[i].id}</p>`;

            const allDetails = `<div id =${goats[i].id} class="card card-block col-12 col-md-4">
            ${divCircle}${deleteGoatButton}${editButton}${colorCode}${sex}${pregnantStatus} ${birthDate} ${sold} ${medicalHistory}${vaccins}</div>`;
            $(".container").append(allDetails);
            $("#loading").css("display", "none");

            if (oneUser.admin === "no") {
                $(".edit-button").css("display", "none");
                $(".delete-btn").css("display", "none");
            }

            if (goats[i].colorCode.includes("y") || goats[i].colorCode.includes("Y")) {
                $(`#circle${goats[i].id}`).removeClass("blue");
                $(`#circle${goats[i].id}`).addClass("yellow");
            }

            else if(goats[i].colorCode.includes("b") || goats[i].colorCode.includes("B")){
                $(`#circle${goats[i].id}`).removeClass("yellow");
                $(`#circle${goats[i].id}`).addClass("blue");

            }


            // var n = str.includes("world");
        }

        // display Currencies when clicking on coins Button


        // Display add goat form

        $("#addButton").click(function () {
            $(".container-change").empty();
            let formGroup = `<div id="form" class=form-group>
            <button class="btn btn-danger close-button">x</button>
           <label for="sex">Sex: </label>
           <select class="form-control" id="addSex">
             <option>Male</option>
             <option>Female</option>
           </select>

           <label for="birthDate">Birth Date: </label>
           <input type="date" class="form-control" name="birthDate" id="birthDate" >
           <label for="pregnantStatus">Pregnant Status</label>
           <select class="form-control" id="pregnantStatus">
             <option>Yes</option>
             <option>No</option>
           </select>
           <label for="sold">Sold: </label>
           <select class="form-control" id="soldInput">
             <option>Yes</option>
             <option>No</option>
           </select>
           <label for="colorCode">Color Code: </label>
           <input type="text" class="form-control" name="colorCode" id="colorCode" >
           <label for="medicalHistory">Medical History</label>
           <textarea type="text" class="form-control"  name="medicalHistory" id="medicalHistory" ></textarea>

           <label for="vaccins">Vaccins</label>
           <textarea type="text" class="form-control"  name="vaccins" id="vaccins"></textarea>
           <button class="btn btn-secondary" id="add-button">Add a goat</button>
           
           `

            $(".container-change").append(formGroup);

            // $("#form").css("display", "block")
        });



        // Add a goat
        $(".container-change").on("click", "#add-button", async function () {
            oneGoat = {};
            let sex = document.getElementById("addSex").value;
            let birthDate = document.getElementById("birthDate").value;
            let pregnantStatus = document.getElementById("pregnantStatus").value;
            let soldInput = document.getElementById("soldInput").value;
            let colorCode = document.getElementById("colorCode").value;
            let medicalHistory = document.getElementById("medicalHistory").value;
            let vaccins = document.getElementById("vaccins").value;
            oneGoat = {

                "sex": sex,
                "birthDate": birthDate,
                "pregnantStatus": pregnantStatus,
                "sold": soldInput,
                "medicalHistory": medicalHistory,
                "colorCode": colorCode,
                "vaccins": vaccins
            }

            const jsonResp = await fetch("http://localhost:5000/goats", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(oneGoat)
            });
            console.log(jsonResp);
            alert("goat has been added, please refresh to see the added goat");
            $(".container-change").empty()
            // window.location.reload();

        });

        // Search for a specific coin in all 5000 Coins

        $("#searchButton").click(() => {
            let id = $("#searchBox").val();

            displaySearchCurrencies(id);
        })


        // function Loading when waiting to get the Data

        function loading(id) {
            const loading = `<div class="loader"></div>`;
            $(`.${id}`).append(loading);
        }


    });
})();
