angular.module('util.url', [])

    .factory('url', function() {
        var host = "http://localhost:8000";

        return {
            signIn: host + "/signin",
            signUp: host + "/signup",

            carMaker: host + "/car/maker",
            carModel: host + "/car/model",
            cars: host + "/car/user",
            newCar: host + "/car/new",
            editCar: host + "/car/update",
            deleteCar: host + "/car/delete",

            payments: host + "/payment/user",
            newPayment: host + "/payment/new",
            editPayment: host + "/payment/update",
            deletePayment: host + "/payment/delete",

            updateUser: host + "/user/update/user",
            updateHome: host + "/user/update/home",
            updateWork: host + "/user/update/work",
            updatePassword: host + "/user/update/password",

            userServices: host + "/service/user",
            openings: host + "/service/opening",
            placeOrder: host + ""
        };
    });
