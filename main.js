(() => {
    $(() => {

        let goats = [];
        let users = [];
        let oneGoat = {};
        let oneUser = "";
        let newUser = "";

        // if (process.env.NODE_ENV !== 'production') {

        // } else {

        // }
        // var x = window.matchMedia("(max-width: 684px)");
        // x.addListener()


        UserExists();
        // displayGoats();


        async function getGoats() {
            await fetch("https://my-json-server.typicode.com/daph87/goats/goats")
                .then(function(resp) {
                    return resp.json();
                })
                .then(function(data) {
                    goats = data;
                    goats.sort(function(a, b) {
                        return new Date(a.birthDate) - new Date(b.birthDate)
                    });
                    console.log(goats, "goats")
                })
        }

        function displayGoats() {
            $("#loading").css("display", "block");
            goats.sort(function(a, b) {
                return new Date(a.birthDate) - new Date(b.birthDate)
            });

            for (let i = 0; i < goats.length; i++) {
                goatsContentBox(goats, i);

            }
        }

        // Close Button

        $(".container-change").on("click", ".close-button", function() {
            $(".container-change").empty();
        })


        // Logout

        $("#logOutButton").click(function() {
            localStorage.clear();
            $(".container").empty();
            $(".container-change").empty();
            $("#addButton").css("display", "none");
            $("#logOutButton").css("display", "none");
            $("#registerButton").css("display", "none");
            $("#usersButton").css("display", "none");
            $("#search").empty();
            displayLogin();
        })


        //Display Users
        function displayUsers() {
            users.forEach(user => {
                let username = `<p class="user-username">Username: ${user.username} </p>`;
                let password = `<p>Password: ${user.password}</p>`;
                let admin = `<p>Admin: ${user.admin}</p>`;
                let button = `<button id="deleteUser" class="btn btn-primary">Delete User</button>`
                let allUsers = `<div id="${user.id}" class="users-card card card-block col-12 col-md-4">${username}${password}${admin}${button}</div>`;

                $(".container").append(allUsers);
            })
        }

        // See All users 
        $("#usersButton").click(function() {
            $(".container").empty();
            displayUsers();

        })

        //Delete User


        $(".container").on("click", ".users-card", async function() {
            if (window.confirm("Do you really want to delete this user?")) {

                (async() => {
                    let deletedUser;
                    users.forEach(user => {
                        if (user.id == this.id) {
                            deletedUser = user
                        }
                    });

                    let index = users.indexOf(deletedUser);
                    users.splice(index, 1);
                    $(".container").empty();
                    displayUsers();

                    const jsonResp = await fetch(`https://my-json-server.typicode.com/daph87/goats/users/${this.id}`, {
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

                alert("this user has been deleted");
            }
        })

        // Home Display

        $("#home").click(function() {
                $(".container").empty();
                $(".container-change").empty();
                displayGoats();
            })
            // Click on register on menu 
        $("#registerButton").click(function() {
            $(".container").empty();
            $(".container").append(registerForm);
        })

        //  See register form
        function registerForm() {
            let newUsername = `<input class="form-control" type="text" id="newUsername" value="" placeholder="Username">`;
            let newPassword = `<input class="form-control" type="text" id="newPassword" value="" placeholder="Password">`;
            let admin = `<select id="newAdmin" class="form-control">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>`;
            let button = `<button class="btn btn-primary registerUser" id="register">Register a new user</button>`
            let registerForm = `<div class="form">${newUsername}${newPassword}${admin}${button}</div>`;

            return registerForm
        }



        // Register

        $(".container").on("click", "#register", async function() {
            newUser = {};
            let username = document.getElementById("newUsername").value;
            let password = document.getElementById("newPassword").value;
            let admin = document.getElementById("newAdmin").value;

            if (!username || !password || !admin) {
                alert("All fields are compulsory");
            } else {
                newUser = {
                    username,
                    password,
                    admin
                }

                const jsonResp = await fetch("https://my-json-server.typicode.com/daph87/goats/users", {
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
            }

        });




        //  Get user data
        async function getUsers() {
            await fetch("https://my-json-server.typicode.com/daph87/goats/users")
                .then(function(resp) {
                    return resp.json();
                })
                .then(function(data) {
                    users = data;
                    console.log(users);

                })

            // displayLogin();

        }

        function displayLogin() {

            let username = `<input class="form-control" type="text" id="username" value="" placeholder="Username">`;
            let password = `<input class="form-control" type="password" id="password" value="" placeholder="Password">`;
            let button = `<button class="logUser btn btn-primary" id="login">Log in </button>`
            let loginForm = `<div class="form">${username}${password}${button}</div>`;
            $(".container").append(loginForm);
        }


        //login into database website

        async function UserExists() {
            await getUsers();
            await getGoats();
            var str = localStorage.getItem("userDetails");
            oneUser = JSON.parse(str);

            showButtons(oneUser);

        }


        function showButtons(oneUser) {
            if (oneUser) {


                // $(".container").empty();
                $("#addButton").css("display", "block");
                $("#logOutButton").css("display", "block");
                if (oneUser.admin === "yes") {
                    $("#registerButton").css("display", "block");
                    $("#usersButton").css("display", "block");
                    $("#searchDiv").css("display", "block");
                } else {
                    $("#searchDiv").css("display", "none");
                }

                displayGoats();

                viewSearchBar();

            } else {
                $("#addButton").css("display", "none");
                $("#logOutButton").css("display", "none");
                displayLogin();

            }
        }

        function viewSearchBar() {

            let searchSex =
                `<label>Sex:</label>
            <select class="form-control" id="sexSearch">
            <option selected="true" disabled></option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>`;
            let searchAge = `
            <label>Date:</label><input type="date" id="searchAge" class="form-control" value="" placeholder="search Age">`;
            let searchColor = `<label>Color:</label><select class="form-control" id="colorSearch">
            <option selected="true" disabled></option>
            <option value="b">Blue</option>
            <option value="y">Yellow</option>
          </select><button class="btn btn-secondary btn-sm search-buttons" id="searchValues">Search</button>`;

            let searchGoat = `<input class="form-control" type="text" id="searchGoat" value="" placeholder="code"><button class="search-buttons btn btn-sm btn-dark" id="goatSearchButton">Goat</button>`;
            let searchBar = `${searchSex}${searchAge}${searchColor}${searchGoat}`

            $("#search").append(searchBar);
        }

        // Search goat by values
        $("#search").on("click", "#searchValues", function() {
            let goatBirthDate = $("#searchAge").val();
            let sexGoat = $("#sexSearch").val();
            let colorGoat = $("#colorSearch").val();


            if (!goatBirthDate && !sexGoat && !colorGoat) {
                alert("Please insert at least one value")
            } else {
                $(".container").empty();
                let sexSearchFound = []
                let colorGoatFound = [];
                let colorGoatTwo = [];
                let goatFound = [];
                let goatFoundTwo = []


                goats.forEach(goat => {
                    if (sexGoat) {
                        if (goat.sex === sexGoat) {
                            sexSearchFound.push(goat);
                        }
                    }

                })
                if (!sexGoat) {
                    sexSearchFound = goats;
                }
                colorGoatFound = sexSearchFound;
                colorGoatFound.forEach(color => {
                    if (colorGoat) {
                        if (color.colorCode.includes(colorGoat) || color.colorCode.includes(colorGoat.toUpperCase())) {
                            colorGoatTwo.push(color);
                        }
                    }
                })

                if (!colorGoat) {
                    goatFound = colorGoatFound
                } else {
                    goatFound = colorGoatTwo;
                }

                goatFound.forEach(oneGoat => {
                    if (goatBirthDate) {
                        if (oneGoat.birthDate > goatBirthDate) {
                            goatFoundTwo.push(oneGoat)
                        }
                    }
                })
                if (!goatBirthDate) {
                    goatFoundTwo = goatFound
                }
                goatFoundTwo.sort(function(a, b) {
                    return new Date(a.birthDate) - new Date(b.birthDate)
                });

                for (let i = 0; i < goatFoundTwo.length; i++) {
                    goatsContentBox(goatFoundTwo, i);
                }
            }

        })

        // Search by goat colorCode

        $("#search").on("click", "#goatSearchButton", function() {
            let goatID = $("#searchGoat").val();
            let goatIDDateFound = [];
            if (!goatID) {
                alert("Please insert a value")
            } else {
                $(".container").empty();
                goats.forEach(goat => {
                    if (goat.colorCode.toUpperCase() == goatID.toUpperCase()) {
                        goatIDDateFound.push(goat)
                    }
                })

                goatIDDateFound.sort(function(a, b) {
                    return new Date(a.birthDate) - new Date(b.birthDate)
                });

                for (let i = 0; i < goatIDDateFound.length; i++) {
                    goatsContentBox(goatIDDateFound, i);
                }
            }

        })

        $(".container").on("click", "#login", function() {

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
                        $("#usersButton").css("display", "block");
                        $("#searchDiv").css("display", "block");
                    } else {
                        $("#searchDiv").css("display", "none");
                    }
                    displayGoats();

                }
            }

            if (oneUser === "") {
                alert("Your credentials are not correct");
            } else {
                viewSearchBar();
            }

        });


        // Edit a goat 
        $(".container-change").on("click", ".edit-btn", function() {
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
                        oneGoat = goats[i];
                    }
                }
                console.log(oneGoat.sex, 'colorCode')
                $(".container").empty();
                displayGoats();

                (async() => {
                    const jsonResp = await fetch(`https://my-json-server.typicode.com/daph87/goats/goats/${oneGoat.id}`, {
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
                alert("your changes have been made");
                // window.location.reload();

            }

        });

        // See edit form
        $(".container").on("click", ".edit-button", function() {
            $(".container-change").empty();
            $(".container").empty();
            for (let i = 0; i < goats.length; i++) {
                if ((`${this.id}`) == (goats[i].id)) {
                    console.log(this.id, goats[i].id, "this id")

                    var closeButton = `<button class="btn btn-danger close-button">x</button>`
                    var inputColorCode = `<label>Color Code</label><input class="form-control" type="text" id="color${goats[i].id}" value="${goats[i].colorCode}">`;
                    var inputSex = `<label>Goat Sex</label><select class="form-control" id="sex${goats[i].id}">
                    <option selected="true" value="${goats[i].sex}">${goats[i].sex} - Original Value</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>`;
                    var inputPregnantStatus =
                        `<label>Pregnancy Status</label><select class="form-control" id="status${goats[i].id}">
                    <option selected="true" value="${goats[i].pregnantStatus}">${goats[i].pregnantStatus} - Original Value</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>`;
                    var inputBirthDate = `<label>Birth Date</label><input class="form-control" type="date" id="birth${goats[i].id}" value="${goats[i].birthDate}" placeholder="name">`;
                    var inputSold =
                        `<label>Sale Status</label><select class="form-control" id="sold${goats[i].id}">
                    <option selected="true" value="${goats[i].sold}">${goats[i].sold} - Original Value</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>`;
                    var inputMedicalHistory = `<label>Medical History</label><input class="form-control" type="text" id="medical${goats[i].id}" value="${goats[i].medicalHistory}" placeholder="name">`;
                    var inputVaccins = `<label>Vaccins</label><input  class="form-control" type="text" id="vaccins${goats[i].id}" value="${goats[i].vaccins}" placeholder="name">`;
                    var editGoatButton = `<button class="edit-btn btn btn-dark goatEdited" id="${goats[i].id}">Edit</button>`
                    var allDetails = `<div class="form">${closeButton}${inputColorCode}${inputSex}${inputPregnantStatus}${inputBirthDate}${inputSold}${inputMedicalHistory}${inputVaccins}${editGoatButton}</div>`;
                    $(".container-change").append(allDetails);
                }
            }


        });

        // Delete goat
        $(".container").on("click", ".delete-btn", function() {

            if (window.confirm("Do you really want to delete this beautiful goat?")) {

                (async() => {
                    let deletedGoat;
                    goats.forEach(goat => {
                        if (goat.id == this.id) {
                            deletedGoat = goat
                        }
                    });

                    let index = goats.indexOf(deletedGoat);
                    goats.splice(index, 1);
                    $(".container").empty();
                    displayGoats();

                    const jsonResp = await fetch(`https://my-json-server.typicode.com/daph87/goats/goats/${this.id}`, {
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
            const deleteGoatButton = `<button class="delete-btn btn btn-danger" id="${goats[i].id}">Delete Goat</button>`

            const id = `<p class="card-title">ID: ${goats[i].id}</p>`;

            const allDetails = `<div id =${goats[i].id} class="card">
            <div class="card-buttons">${editButton}${deleteGoatButton}</div>${colorCode}${sex}${divCircle}${pregnantStatus} ${birthDate} ${sold} ${medicalHistory}${vaccins}</div>`;
            $(".container").append(allDetails);
            $("#loading").css("display", "none");

            if (oneUser.admin === "no") {
                $(".card-buttons").css("display", "none");
                $(".edit-button").css("display", "none");
                $(".delete-btn").css("display", "none");

            }

            if (goats[i].colorCode.includes("y") || goats[i].colorCode.includes("Y")) {
                $(`#circle${goats[i].id}`).removeClass("blue");
                $(`#circle${goats[i].id}`).addClass("yellow");
            } else if (goats[i].colorCode.includes("b") || goats[i].colorCode.includes("B")) {
                $(`#circle${goats[i].id}`).removeClass("yellow");
                $(`#circle${goats[i].id}`).addClass("blue");

            }
            $("#loading").css("display", "none");
        }

        // Display add goat form

        $("#addButton").click(function() {
            $(".container-change").empty();
            let formGroup = `<div class="form" class=form-group>
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
           <button class="btn btn-secondary" id="add-button">Add a goat</button>`

            $(".container-change").append(formGroup);
        });



        // Add a goat
        $(".container-change").on("click", "#add-button", async function() {
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

            if (!sex) {
                alert("Please insert the sex of the goat")
            } else if (!birthDate) {
                alert("Please insert the birth date")
            } else if (!pregnantStatus) {
                alert("Please insert the pregnant status")
            } else if (!colorCode) {
                alert("Color code is mandatory")
            } else if (!medicalHistory) {
                alert("Please insert the medical history")
            } else if (!soldInput) {
                alert("This field is mandatory")
            } else if (!vaccins) {
                alert("This field is mandatory")
            } else {

                const jsonResp = await fetch("https://my-json-server.typicode.com/daph87/goats/goats", {
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
            }


        });


        // function Loading when waiting to get the Data

        function loading(id) {
            const loading = `<div class="loader"></div>`;
            $(`.${id}`).append(loading);
        }


    });
})();