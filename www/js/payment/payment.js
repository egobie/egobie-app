angular.module('app.payment', ['ionic', 'util.shared', 'util.url'])

    .config(function($stateProvider) {
        $stateProvider
            .state('menu.payment', {
                url: '/payment',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/payment/payment.html'
                    }
                }
            });
    })

    .controller('paymentCtrl', function($scope, $ionicModal, $ionicPopup, $ionicActionSheet, $http, shared, url) {
        $scope.payments = shared.getUserPayments();

        $scope.payment = {
            id: 0,
            name: "",
            number: "",
            cvv: "",
            month: "",
            year: "",
            zip: ""
        };

        $scope.showPaymentActionSheet = function(payment) {
            $scope.hidePaymentActionSheet = $ionicActionSheet.show({
                titleText: 'Manage Payment',

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
                    
                }
            });
        };

        $ionicModal.fromTemplateUrl('templates/payment/add.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.addPaymentModal = modal;
        });

        $scope.showAddPayment = function() {
            $scope.addPaymentModal.show();
        };

        $ionicModal.fromTemplateUrl('templates/payment/edit.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.editPaymentModal = modal;
        });

        $scope.showEditPayment = function(payment) {
            $scope.payment.id = payment.id;
            $scope.payment.name = payment.account_name;
            $scope.payment.number = "";
            $scope.payment.cvv = "";
            $scope.payment.month = payment.expire_month;
            $scope.payment.year = payment.expire_year;
            $scope.payment.zip = payment.account_zip;

            $scope.editPaymentModal.show();
        };

        $scope.deletePayment = function(id) {
            $ionicPopup.confirm({
                title: "Are you sure to delete this payment?"
            }).then(function(sure) {
                if (sure) {
                    $http
                        .post(url.deletePayment, shared.getRequestBody({
                            id: id
                        }))
                        .success(function(data, status, headers, config) {
                            shared.deleteUserPayment(id);
                            $scope.hidePaymentActionSheet();
                        })
                        .error(function(data, status, headers, config) {
                            shared.alert(data);
                            $scope.hidePaymentActionSheet();
                        });
                }
            });
        };

        $scope.noPayment = function() {
            return Object.keys($scope.payments).length === 0;
        };
    });