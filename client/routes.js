FlowRouter.route('/', {
  name: 'Any',
  action(params, queryParams) {
    console.log(params, queryParams);
  }
});

FlowRouter.route('/admin', {
  name: 'Admin',
  action(params, queryParams) {
    Session.set('nav', false);
    Session.set('content', 'adminView');
  }
});

FlowRouter.route('/print', {
  name: 'Print',
  action(params, queryParams) {
    Session.set('nav', false);
    Session.set('content', 'printView');
  }
});

FlowRouter.route('/generate', {
  name: 'Print',
  action(params, queryParams) {
    Session.set('nav', false);
    Session.set('content', 'generate');
  }
});
