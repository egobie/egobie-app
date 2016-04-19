angular.module('app.payment', ['ionic', 'util.shared', 'util.url'])

    .service('getUserPayments', function($http, shared, url) {
        shared.showLoading();

        var userPayments = null;
        var promise = $http
            .post(url.payments, {
                user_id: shared.getUser().id
            }, {
                headers: shared.getHeaders()
            })
            .success(function(data, status, headers, config) {
                shared.hideLoading();
                userPayments = data;
            })
            .error(function(data, status, headers, config) {
                shared.hideLoading();
                shared.alert(data);
            });

        return {
            promise: promise,
            getData: function() {
                return userPayments;
            }
        };
    })

    .config(function($stateProvider) {
        $stateProvider
            .state('menu.payment', {
                url: '/payment',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/menu/payment.html'
                    }
                },
                resolve: {
                    'ResolveUserPayments': function(getUserPayments) {
                        return getUserPayments.promise;
                    }
                }
            });
    })

    .controller('paymentCtrl', function($scope, $ionicModal, $ionicPopup, $ionicActionSheet, $http, getUserPayments, shared, url) {
        $scope.payments = {};
        $scope.years = [];
        $scope.months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

        Array.prototype.forEach.call(getUserPayments.getData(), function(payment) {
            $scope.payments[payment.id] = payment;
        });

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

        $scope.showPaymentActionSheet = function(payment) {
            $scope.hidePaymentActionSheet = $ionicActionSheet.show({
                titleText: 'Actions',

                buttons: [
                    { text: 'Edit' }
                ],
                buttonClicked: function(index) {
                    $scope.hidePaymentActionSheet();

                    if (index === 0) {
                        $scope.showEditPayment(payment);
                    }
                },

                destructiveText: 'Delete',
                destructiveButtonClicked: function() {
                    $scope.deletePayment(payment.id);
                },

                cancelText: 'Cancel',
                cancel: function() {
                    console.log('Cancel');
                }
            });
        };

        $ionicModal.fromTemplateUrl('add-payment', {
            scope: $scope
        }).then(function(modal) {
            $scope.addPaymentModal = modal;
        });

        $ionicModal.fromTemplateUrl('edit-payment', {
            scope: $scope
        }).then(function(modal) {
            $scope.editPaymentModal = modal;
        });

        $scope.showAddPayment = function() {
            $scope.addPaymentModal.show();
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

            console.log(newPayment);
            shared.showLoading();

            $http
                .post(url.newPayment, newPayment, {
                    headers: shared.getHeaders()
                })
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    addPayment(data);
                    $scope.hideAddPayment();
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        $scope.showEditPayment = function(payment) {
            $scope.payment.id = payment.id;
            $scope.payment.name = payment.account_name;
            $scope.payment.number = "";
            $scope.payment.cvv = "";
            $scope.payment.month = payment.expire_month;
            $scope.payment.year = payment.expire_year;

            $scope.editPaymentModal.show();
        };

        $scope.editPayment = function() {
            var payment = {
                "id":  $scope.payment.id,
                "user_id": shared.getUser().id,
                "account_name": $scope.payment.name.toUpperCase(),
                "account_number": $scope.payment.number + "",
                "account_type": "CREDIT",
                "code": $scope.payment.cvv + "",
                "expire_month": $scope.payment.month,
                "expire_year": $scope.payment.year
            };

            if (!validatePayment(payment)) {
                return;
            }

            console.log(payment);
            shared.showLoading();

            $http
                .post(url.editPayment, payment, {
                    headers: shared.getHeaders()
                })
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    addPayment(data);
                    $scope.hideEditPayment();
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        $scope.hideEditPayment = function() {
            clearSelected();
            $scope.editPaymentModal.hide();
        };

        $scope.deletePayment = function(id) {
            $ionicPopup.confirm({
                title: "Are you sure to delete this payment?"
            }).then(function(sure) {
                if (sure) {
                    $http
                        .post(url.deletePayment, {
                            id: id,
                            user_id: shared.getUser().id
                        }, {
                            headers: shared.getHeaders()
                        })
                        .success(function(data, status, headers, config) {
                            deletePayment(id);
                            $scope.hidePaymentActionSheet();
                        })
                        .error(function(data, status, headers, config) {
                            shared.alert(data);
                            $scope.hidePaymentActionSheet();
                        });
                }
            });
        };

        function addPayment(payment) {
            $scope.payments[payment.id] = payment;
        };

        function deletePayment(id) {
            delete $scope.payments[id];
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
                $ionicPopup.alert({
                    title: "Please input the card's holder name!"
                });
                return false;
            }

            if (!payment.account_number) {
                $ionicPopup.alert({
                    title: "Please input card number!"
                });
                return false;
            }

            if (!payment.expire_year) {
                $ionicPopup.alert({
                    title: "Please choose the expiration year!"
                });
                return false;
            }

            if (!payment.expire_month) {
                $ionicPopup.alert({
                    title: "Please choose the expiration month!"
                });
                return false;
            }

            if (!payment.code) {
                $ionicPopup.alert({
                    title: "Please input CVV!"
                });
                return false;
            }

            return true;
        };

    });