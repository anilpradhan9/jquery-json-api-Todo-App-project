

function LoadView(url) {
    $.ajax({
        method: 'get',
        url: url,
        success: (response) => {
            $("section").html(response)
        }
    });

}
//Jquery LOad Action
$(() => {

    if ($.cookie('uname')) {
        LoadDashBord()
    } else {
        LoadView('./home.html')
    }

    $(document).on('click', '#home-register-btn', () => {
        LoadView('./register.html')
    })


    $(document).on('click', '#home-login-btn', () => {
        LoadView('./login.html')
    })
    $(document).on('click', '#btn-home', () => {
        LoadView('./home.html')
    })
    //Verify User Name

    $(document).on('keyup', "#txtUserName", () => {
        $.ajax({
            method: 'get',
            url: 'http://localhost:4040/users',
            success: (users) => {
                for (var user of users) {
                    if (user.username === $("#txtUserName").val()) {
                        $("#lblUserError").html('User Name Taken -try Another')
                        break;
                    } else {
                        $("#lblUserError").html("User Name is Avalabe")
                    }
                }
            }
        })
    })

    //Register CLick
    $(document).on('click', '#btnRegister', () => {
        var user = {
            username: $("#txtUserName").val(),
            password: $("#txtPassword").val(),
            email: $("#txtEmail").val()
        };
        $.ajax({
            method: 'post',
            url: 'http://localhost:4040/users',
            data: JSON.stringify(user)
        });
        alert('Register Successufuly...');
        LoadView('./home.html')
    });

    ///////////////////
    function LoadDashBord() {
        $.ajax({
            method: 'get',
            url: './dashbord.html',
            success: (response) => {
                $("section").html(response)
                $("#active-user").html($.cookie('uname'));
                $.ajax({
                    method: 'get',
                    url: 'http://localhost:4040/appointments',
                    success: (appointments => {

                        var results = appointments.filter(appointment => appointment.username === $.cookie('uname'));

                        results.map(appointment => {
                            $(`<div class="alert alert-success">
                                             <h3>${appointment.title}</h3>
                                             <p>${appointment.description}</p>
                                             <div>${appointment.date}</div>
                                             <div>
                                                <button id="btn-edit" value=${appointment.id} data-bs-target="#edit-appointment" data-bs-toggle="modal" class="bi bi-pen-fill btn btn-warning" ></button>
                                                 <button id="btn-delete" value=${appointment.id} class="bi bi-trash btn btn-danger" ></button>
                                             </div>
                                                </div> ` ).appendTo('#appointment-cards')
                        })
                    })
                })
            }
        })
    }

    //login click
    $(document).on('click', '#btnLogin', () => {
        $.ajax({
            method: 'get',
            url: 'http://localhost:4040/users',
            success: (users) => {
                var user = users.find(item => item.username === $("#txtUserName").val());
                if (user) {
                    if (user.password === $("#txtPassword").val()) {
                        $.cookie('uname', $("#txtUserName").val())
                        LoadDashBord();


                    } else {
                        alert("Invalid Password")
                    }

                } else {
                    alert('Invalid User Name')
                }

            }
        })

    })
    //signOutClick

    $(document).on('click', '#btnsignOut', () => {
        $.removeCookie('uname')
        LoadView('./home.html')
    })

    //Add  Appointment Click
    $(document).on('click', '#btn-add', () => {
        var appointment = {
            title: $("#appointment-title").val(),
            description: $("#appointment-description").val(),
            date: $("#appointment-date").val(),
            username: $.cookie('uname')
        }
        $.ajax({
            method: 'post',
            url: 'http://localhost:4040/appointments',
            data: JSON.stringify(appointment),
            success: () => {
                LoadDashBord()
            }

        })
    })
    //delete appointment
    $(document).on('click', '#btn-delete', (e) => {
        var flag = confirm('Are You Sure ?\n Want to Delete?')
        if (flag) {
            $.ajax({
                method: "delete",
                url: `http://localhost:4040/appointments/${e.target.value}`
            });
            LoadDashBord();
        }
    })
    //Edit Appointment
    $(document).on('click', '#btn-edit', (e) => {
        $.ajax({
            method: 'get',
            url: `http://localhost:4040/appointments/${e.target.value}`,
            success:(appointment )=>{
                $("#edit-appointment-id").val(appointment.id);
                $("#edit-appointment-title").val(appointment.title);
                $("#edit-appointment-description").val(appointment.description);
                $("#edit-appointment-date").val(appointment.date);
            }

        })

    })
     // Update and save Appointment
     $(document).on('click','#btn-save',()=>{
        var appointment = {
            id:$("#edit-appointment-id").val(),
            title: $("#edit-appointment-title").val(),
            description: $("#edit-appointment-description").val(),
            date: $("#edit-appointment-date").val(),
            username: $.cookie('uname')
        }
         $.ajax({
            method:'put',
            url:`http://localhost:4040/appointments/${$("#edit-appointment-id").val()}`,
            data:JSON.stringify(appointment)
         });
         LoadDashBord()
     })
})