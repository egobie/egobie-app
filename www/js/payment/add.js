angular.module('app.payment.add', ['ionic', 'util.shared', 'util.url'])

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
            year: ""
        };

        $scope.hideAddPayment = function() {
            clearSelected();
            $scope.addPaymentModal.hide();
        };

        $scope.createPayment = function() {
            var newPayment = {
                "user_id": shared.getUser().id,
                "account_name": $scope.payment.name.toUpperCase(),
                "account_number": $scope.payment.number + "",
                "account_type": "CREDIT",
                "code": $scope.payment.cvv + "",
                "expire_month": $scope.payment.month,
                "expire_year": $scope.payment.year
            };

            if (!validatePayment(newPayment)) {
                return;
            }

            shared.showLoading();

            $http
                .post(url.newPayment, newPayment, {
                    headers: shared.getHeaders()
                })
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
        };

        function validatePayment(payment) {
            if (!payment.account_name) {
                shared.alert("Please input the card's holder name!");
                return false;
            }

            if (!payment.account_number) {
                shared.alert("Please input card number!");
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