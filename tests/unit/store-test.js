import Store from 'ember-cli-mirage/store';

var store;
module('mirage:store');

test('it can be instantiated', function() {
  store = new Store();
  ok(store);
});


module('mirage:store#loadData', {
  setup: function() {
    store = new Store();
  },
  teardown: function() {
    store.emptyData();
  }
});

test('can load an object as its database', function() {
  var data = {contacts: [{id: 1, name: 'Link'}]};
  store.loadData(data);

  deepEqual(store._data, data);
});

test('can add data to a single key of its database', function() {
  var contacts = [{id: 1, name: 'Link'}];
  store.loadData(contacts, 'contacts');

  deepEqual(store._data, {contacts: contacts});
});


module('mirage:store#find', {
  setup: function() {
    store = new Store();
  },
  teardown: function() {
    store.emptyData();
  }
});

test('returns a record that matches a numerical id', function() {
  store.loadData({
    contacts: [
      {id: 1, name: 'Link'},
      {id: 2, name: 'Zelda'}
    ]
  });

  var contact = store.find('contact', 1);
  deepEqual(contact, {id: 1, name: 'Link'});
});

test('returns a record that matches a string id', function() {
  store.loadData({
    contacts: [
      {id: 'abc', name: 'Link'},
      {id: 'def', name: 'Zelda'}
    ]
  });

  var contact = store.find('contact', 'abc');
  deepEqual(contact, {id: 'abc', name: 'Link'});
});


module('mirage:store#findAll', {
  setup: function() {
    store = new Store();
  },
  teardown: function() {
    store.emptyData();
  }
});

test('returns all records by type', function() {
  var contacts = [
    {id: 1, name: 'Link'},
    {id: 2, name: 'Zelda'}
  ];
  store.loadData({contacts: contacts});

  deepEqual(store.findAll('contact'), contacts);
});

test("returns an empty array if the key doesn't exist", function() {
  deepEqual(store.findAll('contact'), []);
});

test("returns an empty array if no models exist", function() {
  store.loadData({contacts: []});

  deepEqual(store.findAll('contact'), []);
});


module('mirage:store#findQuery', {
  setup: function() {
    store = new Store();
  },
  teardown: function() {
    store.emptyData();
  }
});

test('returns an array of records that match the query', function() {
  var ganon = {id: 3, name: 'Ganon', evil: true};
  store.loadData({
    contacts: [
      {id: 1, name: 'Link', evil: false},
      {id: 2, name: 'Zelda', evil: false},
      ganon
    ]
  });

  var result = store.findQuery('contact', {evil: true});

  deepEqual(result, [ganon]);
});

test('returns an empty array if no records match the query', function() {
  store.loadData({
    contacts: [
      {id: 1, name: 'Link', evil: false},
      {id: 2, name: 'Zelda', evil: false},
      {id: 3, name: 'Ganon', evil: true}
    ]
  });

  var result = store.findQuery('contact', {name: 'Link', evil: true});

  deepEqual(result, []);
});


module('mirage:store#push', {
  setup: function() {
    store = new Store();
  },
  teardown: function() {
    store.emptyData();
  }
});

test('creates a record if no id attr is present', function() {
  var newContact = store.push('contact', {
    name: 'Link'
  });

  var contacts = store.findAll('contact');

  deepEqual(contacts, [{id: 1, name: 'Link'}]);
  deepEqual(newContact, {id: 1, name: 'Link'});
});

test('creates a record if no id attr is present, and sets new id based on max of existing', function() {
  store.loadData({
    contacts: [
      {id: 1, name: 'Link'}
    ]
  });

  store.push('contact', {
    name: 'Zelda'
  });

  var contacts = store.findAll('contact');

  deepEqual(contacts, [
    {id: 1, name: 'Link'},
    {id: 2, name: 'Zelda'}
  ]);
});

test('updates a record if id attr is present', function() {
  store.loadData({
    contacts: [
      {id: 1, name: 'Link'}
    ]
  });

  store.push('contact', {
    id: 1,
    name: 'The Link'
  });

  var link = store.find('contact', 1);

  deepEqual(link, {id: 1, name: 'The Link'});
});

test("doesn't affect data outside the store", function() {
  var contacts = [
    {id: 1, name: 'Link'}
  ];
  store.loadData({contacts: contacts});
  store.push('contact', {
    name: 'Zelda'
  });

  equal(contacts.length, 1);
});


module('mirage:store#remove', {
  setup: function() {
    store = new Store();
  },
  teardown: function() {
    store.emptyData();
  }
});

test('removes a record by type and id', function() {
  store.loadData({
    contacts: [
      {id: 1, name: 'Link'}
    ]
  });

  store.remove('contact', 1);

  deepEqual(store.findAll('contact'), []);
});


module('mirage:store#removeQuery', {
  setup: function() {
    store = new Store();
  },
  teardown: function() {
    store.emptyData();
  }
});

test('removes records that match the query', function() {
  var link = {id: 1, name: 'Link', evil: false};
  var zelda = {id: 1, name: 'Zelda', evil: false};
  store.loadData({
    contacts: [
      link,
      zelda,
      {id: 3, name: 'Ganon', evil: true},
    ]
  });

  store.removeQuery('contact', {evil: true});

  deepEqual(store.findAll('contact'), [link, zelda]);
});
