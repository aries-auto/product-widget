class ResultDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'E',
      scope: {
          extraValues: '='
      },
      templateUrl: 'app/components/result/result.html',
      link: linkFunc,
      controller: 'ResultController',
      controllerAs: 'lc'
    };

    return directive;

    function linkFunc(scope, el, attr, lc) {

    }

  }
}

export default ResultDirective;