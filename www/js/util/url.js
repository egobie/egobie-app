angular.module('util.url', [])

    .factory('url', function() {
        var host = "http://localhost:8000";
//        var host = "http://ec2-52-91-137-51.compute-1.amazonaws.com:8000";

        return {
            website: "http://www.egobie.com/",

            checkEmail: host + "/check/email",
            checkUsername: host + "/check/name",

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
            pay: host + "/payment/pay",

            updateUser: host + "/user/update/user",
            updateHome: host + "/user/update/home",
            updateWork: host + "/user/update/work",
            updatePassword: host + "/user/update/password",
            feedback: host + "/user/feedback",

            services: host + "/service",
            userReservations: host + "/service/reservation",

            openings: host + "/service/opening",
            ondemand: host + "/service/now",
            placeOrder: host + "/service/order",
            cancelOrder: host + "/service/cancel",
            demandService: host + "/service/demand",
            readService: host + "/service/read/",
            demandAddon: host + "/service/demand/addon",
            demandOpening: host + "/service/demand/opening/",

            userHistories: host + "/history",
            ratingHistory: host + "/history/rating"
        };
    });
