var application = angular.module('application', ['treeControl', 'ngRoute']).config(function ($routeProvider) {
    var always = function ($q, $timeout) {
        $timeout(function () {
            $('.ui-publisher-dialog').addClass('show');
            $('.ui-overlay').css('height', '100%');
        }, 100);
    };

    $routeProvider.when('/phone/add', {
        templateUrl: 'Views/phone.html',
        controller: 'PhoneController',
        resolve: { always: always }
    });

    $routeProvider.when('/phone/edit', {
        templateUrl: 'Views/phone.html',
        controller: 'PhoneController',
        resolve: { always: always }
    });

    $routeProvider.when('/category', {
        templateUrl: 'Views/category.html',
        controller: 'CategoryController',
        resolve: { always: always }
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });
}).service('PhoneService', function () {
    var _$scope = null;

    this.initPhones = function ($scope) {
        _$scope = $scope;
    };

    this.add = function (phone) {
        phone.id = _$scope.$root.nextId++;
        _$scope.phones.push(phone);
        _$scope.initTree();
    };

    this.get = function () {
        return _$scope.phones;
    };
});


/*Контроллеры вывода страниц */
application.controller('HomeController', ['$scope', 'PhoneService', function ($scope, phoneService) {
    $scope.phones = [
        { id: 1, name: 'Мускари', description: 'Блюм', photoUrl: '2016', category: 'Букет' },
        { id: 2, name: 'Азуреум', description: 'Подвид 2', photoUrl: '2016', category: 'Садовые розы' },
        { id: 3, name: 'Гиацинт Джипси', description: 'Остролистный', photoUrl: '2016', category: 'Букет' },
        { id: 4, name: 'Майский цветок', description: 'зимняя посадка', photoUrl: '2016', category: 'Клематисы' },
        { id: 5, name: 'Виолет', description: 'Спицевая', photoUrl: '2016', category: 'Лианы' },
        { id: 6, name: 'Бьюти', description: 'Анкерная', photoUrl: '2016', category: 'Кустарники' },
        { id: 7, name: 'Падуб', description: 'Подвид 2', photoUrl: '2016', category: 'Плодовые' },
        { id: 8, name: 'Айс Кинг', description: 'Подвид 2', photoUrl: '2016', category: 'Букет' }
    ];

    $scope.$root.nextId = $scope.phones.length + 1;
    $scope.$root.categories = [... new Set($scope.phones.map(phone => phone.category))];
    phoneService.initPhones($scope);

    $scope.addPhone = function () {
        window.location = '#/phone/add';
    };

    $scope.addCategory = function () {
        window.location = '#/category';
    };

    $scope.select = function (selectedPhone) {
        $scope.phones.forEach(function (phone) {
            phone.selected = false;
        });

        selectedPhone.selected = true;
    };

    $scope.remove = function () {
        var phones = $scope.phones.filter(function (phone) {
            return !phone.selected;
        });

        phoneService.initPhones($scope);
        $scope.phones = phones;
    };

    $scope.edit = function () {
        var phones = phoneService.get().filter(function (phone) {
            return phone.selected;
        });

        if (phones[0]) {
            window.location = '#/phone/edit';
        }
    };

    $scope.treeOptions = {
        nodeChildren: "children",
        dirSelectable: true,
        injectClasses: {
            ul: "a1",
            li: "a2",
            liSelected: "a7",
            iExpanded: "a3",
            iCollapsed: "a4",
            iLeaf: "a5",
            label: "a6",
            labelSelected: "a8"
        }
    };

    $scope.initTree = function () {
        $scope.$root.treeData = $scope.$root.categories
            .map(category => ({name: category, children:[]}));



        $scope.phones.forEach(function (phone) {
            $scope.$root.treeData.find(a=>a.name == phone.category).children.push(phone);
        });
        $scope.$root.categories = $scope.treeData.map(data => data.name);
    };

    $scope.initTree();
}]);

application.controller('PhoneController', ['$scope', 'PhoneService', function ($scope, phoneService) {
    var editPhone;
    $scope.canEdit = window.location.hash === '#/phone/edit';

    if ($scope.canEdit) {
        var phones = phoneService.get().filter(function (phone) {
            return phone.selected;
        });

        editPhone = phones[0];

        if (editPhone) {
            $scope.name = editPhone.name;
            $scope.description = editPhone.description;
            $scope.photoUrl = editPhone.photoUrl;
            $scope.category = editPhone.category;
        }
    }


    $scope.submit = function () {
        if ($scope.canEdit) {
            editPhone.name = $scope.name;
            editPhone.description = $scope.description;
            editPhone.category = $scope.category;
        } else {
            phoneService.add({ name: $scope.name, description: $scope.description, category: $scope.category, photoUrl: '2016' });
        }

        $scope.cancel();
    };

    $scope.cancel = function () {
        window.location = "#/";
    };
}]);

application.controller('CategoryController', ['$scope', 'PhoneService', function ($scope, PhoneService) {
    $scope.cancel = function () {
        window.location = "#/";
    };

    $scope.addCat = (category) => {
        $scope.$root.categories.push(category);
        $scope.$root.treeData.push({ name: category, children: [] });
        $scope.cancel();
    }
}]);

application.controller('SortableController', ['$scope', 'PhoneService', function ($scope) {
    $scope.cancel = function () {
        window.location = "#/";
    };
}]);
