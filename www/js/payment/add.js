angular.module('app.payment.add', ['ionic', 'credit-cards', 'util.shared', 'util.url'])

    .controller('paymentAddCtrl', function($scope, $http, shared, url) {
        $scope.years = [];
        $scope.months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

        for (var _i = 0, _c = new Date().getFullYear(); _i <= 10; _i++) {
            $scope.years.push((_c + _i) + "");
        }

        $scope.payment = {
            id: 0,
            name: "",
            number: "",
            cvv: "",
            month: "",
            year: "",
            zip: ""
        };

        $scope.hideAddPayment = function() {
            clearSelected();
            $scope.addPaymentModal.hide();
        };

        $scope.createPayment = function() {
            var newPayment = {
                "account_name": $scope.payment.name.toUpperCase(),
                "account_number": $scope.payment.number + "",
                "account_type": "CREDIT",
                "account_zip": $scope.payment.zip,
                "card_type": "",
                "code": $scope.payment.cvv + "",
                "expire_month": $scope.payment.month,
                "expire_year": $scope.payment.year
            };

            if (!validatePayment(newPayment)) {
                return;
            }

            shared.showLoading();

            $http
                .post(url.newPayment, shared.getRequestBody(newPayment))
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.addUserPayment(data);
                    $scope.hideAddPayment();
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        function clearSelected() {
            $scope.payment.name = "";
            $scope.payment.number = "";
            $scope.payment.cvv = "";
            $scope.payment.month = "";
            $scope.payment.year = "";
            $scope.payment.zip = "";
        };

        function validatePayment(payment) {
            payment.card_type = shared.testCreditCard(payment.account_number);

            if (!payment.account_name || payment.account_name.indexOf(" ") < 0) {
                shared.alert("Please input invalid card's holder name!");
                return false;
            }

            if (payment.card_type === "invalid") {
                shared.alert("Card number is not valid (we only accept American Express" + 
                    ", Visa, Visa Electron, MasterCard and Discover)");
                payment.card_type = "";
                return false;
            }

            if (!payment.account_zip) {
                shared.alert("Please input valid zipcode!");
                return false;
            }

            if (!payment.expire_year) {
                shared.alert("Please choose the expiration year!");
                return false;
            }

            if (!payment.expire_month) {
                shared.alert("Please choose the expiration month!");
                return false;
            }

            if (!payment.code) {
                shared.alert("Please input CVV!");
                return false;
            }

            return true;
        };

    });