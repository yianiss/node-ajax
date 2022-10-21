$(document).ready(function(){
    getData();

    $('#tbody').on('click', '.btnUpdate', function () {
        
        let btnValue = $(this);
        let username = btnValue.val();

        $.ajax({
            url:'https://studently-app.herokuapp.com/user/findOne'+ '?' + $.param({"username": username}),
            type:'get',
            dataType:'JSON'
        })
        .done(function(response){
            // console.log(">>", response);
            let data = response.data;
            let status = response.status
            
            if (status) { 
                $("#username").val(data.username);
                $("#username").prop( "disabled", true );
                $("#password").prop( "disabled", true );
                $("#name").val(data.name);
                $("#surname").val(data.surname);
                $("#category").val(data.category);
                $("#email").val(data.email);

                $('.btnSubmit').val('modify');
                // localStorage.setItem('updateUser', username);
            } else {
                alert(false,'Πρόβλημα στην αναζήτηση του χρήστη (' + data.message + ')');
                // console.log(data);
            }
        });
        
    });

    $('#tbody').on('click', '.btnDelete', function () {
        let btnValue = $(this);
        let username = btnValue.val();

        $.ajax({
            url:'https://studently-app.herokuapp.com/user/delete'+ '?' + $.param({"username": username}),
            type:'delete',
            dataType:'JSON'
        })
        .done(function(response){
            
            let data = response.data;
            let status = response.status
            
            if (status) { 
                getData();
                alert(true,'Επιτυχής διαγραφή του χρήστη');
            } else {
                alert(false,'Πρόβλημα στην διαγραφή του χρήστη(' + data.message + ')');
                // console.log(data);
            }
        });    
    });
    
    $('.row').on('click', '.btnSubmit', function () {
        var username = $("#username").val();
        var name = $("#name").val();
        var surname = $("#surname").val();
        var category = $("#category option:selected").text();
        var email = $("#email").val();

        var item = {
            'username': username,
            'name': name,
            'surname': surname,
            'category': category,
            'email': email
        }

        // console.log($('.btnSubmit').val());

        const checkType = $('.btnSubmit').val();
        // const updateUser = localStorage.getItem('updateUser');

        if (checkType==='modify') {
            $.ajax({
                url: "https://studently-app.herokuapp.com/user/update",
                type: "post",
                data: item,
                dataType: "JSON",
                // encode: true,
            })
            .done(function(response) {
                // console.log(">>", response);
            
                let data = response.data;
                let status = response.status
            
                if (status) { 
                    getData();
                    resetForm();
                    alert(true,'Επιτυχής τροποποίηση του χρήστη');
                    // localStorage.removeItem('updateUser');
                } else {
                    alert(false,'Πρόβλημα στην τροποποίηση του χρήστη(' + data.message + ')');
                    // console.log(data);
                }
            });
        } else {
            $.ajax({
                url: "https://studently-app.herokuapp.com/user/create",
                type: "post",
                data: item,
                dataType: "JSON",
                // encode: true,
            })
            .done(function(response) {
                // console.log(">>", response);
                
                let data = response.data;
                let status = response.status
            
                if (status) { 
                    getData();
                    resetForm();
                    alert(true,'Επιτυχής εισαγωγή του χρήστη');
                } else {
                    alert(false,'Πρόβλημα στην εισαγωγή του χρήστη ('+ data.message + ')');
                    // console.log(data.message);
                }
            });
        }
    });

    $('.row').on('click', '.btnReset', function () { 
        resetForm();
    });
    
  });

  function getData() {
    $.ajax({
        url:'https://studently-app.herokuapp.com/user/findAll',
        type:'get',
        dataType:'JSON'
    })
    .done(function(response){
        // console.log(">>", response);
        let data = response.data;
        let status = response.status
        
        if (status) { 
            createTbody(data);
        } else {
            alert(false,'Πρόβλημα στην αναζήτηση των χρηστών ('+ data.message + ')');
            // console.log(data);
        }
    });
  }

  function createTbody(data){

    $("#userTable > tbody").empty();

    // console.log(data);
    var len = data.length;
    for (var i=0; i<len; i++){
        var username = data[i].username;
        var name = data[i].name;
        var surname = data[i].surname;
        var category = data[i].category;
        var email = data[i].email;
        
        // console.log(username, name);

        var tr_str = "<tr>" +
            "<td>" + username + "</td>" +
            "<td>" + name + "</td>" +
            "<td>" + surname + "</td>" +
            "<td>" + category + "</td>" +
            "<td>" + email + "</td>" +
            "<td>" +
                "<button class='btnUpdate btn btn-primary' value=\'"+username+"\'>Τροποποίηση</button> " +
                "<button class='btnDelete btn btn-primary' value=\'"+username+"\'>Διαγραφή</button>" +
            "</td>" + 
            "</tr>";

        $("#userTable tbody").append(tr_str);
    }
  }

  function resetForm(){
    $('#frmUser')[0].reset();
    $("#username").prop( "disabled", false );
    $("#password").prop( "disabled", false );

    $('.btnSubmit').val('insert');

    // console.log($('.btnSubmit').val());
  }

  function alert(status, message){
    if (status){
        $('.alert').addClass('alert-success');
        $('.alert').removeClass('alert-danger');
    } else {
        $('.alert').addClass('alert-danger');
        $('.alert').removeClass('alert-success');
    }
    $('.alert').html(message);
  }